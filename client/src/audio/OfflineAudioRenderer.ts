import * as Tone from 'tone';
import type { ProjectData, MixerChannel } from '../store/projectStore';
import { AudioFactory, type MixerStrip } from './AudioFactory';

export class OfflineAudioRenderer {

    static async renderProject(project: ProjectData): Promise<Blob> {
        console.log("[OfflineAudioRenderer] Starting Offline Render...");

        // 1. Pre-load Buffers
        const bufferMap = await this._preLoadBuffers(project);

        // 2. Duration
        const durationSeconds = this._calculateDuration(project);
        console.log(`[OfflineAudioRenderer] Duration: ${durationSeconds.toFixed(2)}s`);
        if (durationSeconds <= 0) throw new Error("Project has no duration");

        // 3. Offline Context
        // @ts-ignore
        const offlineBuffer = await Tone.Offline(async (context) => {
            console.log("[OfflineRenderer] Constructing Mixer Graph...");

            // A. MIXER RECONSTRUCTION
            const masterHeadroom = new Tone.Volume(0).toDestination();
            const mixerStrips = this._configureMixer(project, masterHeadroom, context);

            // B. TRACK SETUP
            const trackInstruments = this._createInstruments(project, bufferMap, mixerStrips);

            // C. SCHEDULING
            const transport = Tone.getTransport();
            transport.bpm.value = project.meta.bpm;

            this._scheduleEvents(project, trackInstruments, transport, durationSeconds);

            // Wait for Reverbs or other async nodes to be ready
            if ((context as any)._loadPromises && (context as any)._loadPromises.length > 0) {
                console.log(`[Offline] Waiting for ${(context as any)._loadPromises.length} async effects (Reverb)...`);
                await Promise.all((context as any)._loadPromises);
            }

            console.log("[Offline] Starting Transport...");
            transport.start(0);

        }, durationSeconds);

        console.log("[OfflineAudioRenderer] Render Complete.");
        return this._bufferToWave((offlineBuffer as any).get() as AudioBuffer);
    }

    // --- Extracted Configuration Methods ---

    private static _configureMixer(project: ProjectData, masterHeadroom: Tone.Volume, context: any) {
        const mixerStrips = {
            master: AudioFactory.createMixerStrip('master'),
            groups: {} as Record<string, MixerStrip>,
            inserts: {} as Record<string, MixerStrip>
        };

        // 1. Configure MASTER
        this._setupStrip(mixerStrips.master, project.mixer.master, masterHeadroom, context);

        // 2. Configure GROUPS (1-4)
        for (let i = 1; i <= 4; i++) {
            const id = `group-${i}`;
            const groupData = project.mixer.groups[id] || {
                id, name: `Group ${i}`, volume: 1, pan: 0, muted: false, solo: false, effects: [], output: 'master'
            };

            const strip = AudioFactory.createMixerStrip(id);
            mixerStrips.groups[id] = strip;
            this._setupStrip(strip, groupData as any, mixerStrips.master.input, context);
        }

        // 3. Configure INSERTS (1-10)
        for (let i = 1; i <= 10; i++) {
            const id = `insert-${i}`;
            const insertData = project.mixer.inserts[id] || {
                id, name: `Insert ${i}`, volume: 1, pan: 0, muted: false, solo: false, effects: [], output: 'master'
            };

            const strip = AudioFactory.createMixerStrip(id);
            mixerStrips.inserts[id] = strip;

            // Determine Output Target
            let targetInput = mixerStrips.master.input;
            if (insertData.output && mixerStrips.groups[insertData.output]) {
                targetInput = mixerStrips.groups[insertData.output].input;
            }

            this._setupStrip(strip, insertData as any, targetInput, context);
        }

        return mixerStrips;
    }

    private static _createInstruments(
        project: ProjectData,
        bufferMap: Map<string, Tone.ToneAudioBuffer>,
        mixerStrips: { master: MixerStrip, groups: any, inserts: any }
    ) {
        const trackInstruments = new Map<string, any>();

        for (const trackId of Object.keys(project.tracks)) {
            const trackData = project.tracks[trackId];
            if (trackData.muted) continue;

            let instrument: any;

            if (trackData.instrument.type === 'sampler') {
                const buffer = bufferMap.get(trackId);
                instrument = new Tone.Sampler({
                    urls: buffer ? { C4: buffer } : {},
                });
            } else {
                const params: any = trackData.instrument.synthParams || {};
                const synthOptions = {
                    oscillator: { type: params.oscillatorType || 'triangle' },
                    envelope: params.envelope || { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
                };

                instrument = new Tone.PolySynth(Tone.Synth, synthOptions);
                instrument.volume.value = 0;
            }

            if (!instrument) continue;

            const trackMuteGain = new Tone.Gain(1);
            const trackPanner = new Tone.PanVol(trackData.pan, 0);
            const trackVolDb = trackData.volume > 0 ? 20 * Math.log10(trackData.volume) : -Infinity;

            trackPanner.volume.value = trackVolDb;

            const insertId = trackData.mixerChannelId;
            const destInput = mixerStrips.inserts[insertId] ? mixerStrips.inserts[insertId].input : mixerStrips.master.input;

            instrument.connect(trackPanner);
            trackPanner.connect(trackMuteGain);
            trackMuteGain.connect(destInput);

            trackInstruments.set(trackId, instrument);
        }

        return trackInstruments;
    }

    // Extracted Scheduler
    private static _scheduleEvents(
        project: ProjectData,
        trackInstruments: Map<string, any>,
        transport: any,
        totalDuration: number
    ) {
        let totalEvents = 0;
        const stepDuration = Tone.Time('16n').toSeconds();

        project.timeline.clips.forEach(clip => {
            if (!clip.patternId) return;

            const clipStartTime = clip.start * stepDuration;
            const clipDuration = clip.duration * stepDuration;

            const pattern = project.drumPatterns[clip.patternId] || project.melodicPatterns[clip.patternId];
            if (!pattern) return;

            const patternDuration = pattern.duration * stepDuration;
            if (patternDuration <= 0) return;

            // Process each track in the pattern
            Object.keys(pattern.clips).forEach(trackId => {
                const instrument = trackInstruments.get(trackId);
                if (!instrument) return;

                const notes = pattern.clips[trackId];
                if (!notes) return;

                // Schedule notes for this track/clip
                totalEvents += this._scheduleNotes(
                    notes,
                    instrument,
                    transport,
                    clipStartTime,
                    clipDuration,
                    patternDuration,
                    totalDuration
                );
            });
        });
        console.log(`[Offline] Scheduled ${totalEvents} events.`);
    }

    private static _scheduleNotes(
        notes: any[],
        instrument: any,
        transport: any,
        clipStartTime: number,
        clipDuration: number,
        patternDuration: number,
        totalDuration: number
    ): number {
        let events = 0;

        notes.forEach((note: any) => {
            const noteRelTime = Tone.Time(note.time).toSeconds();

            let loopOffset = 0;
            while (loopOffset < clipDuration) {
                if (loopOffset + noteRelTime < clipDuration) {
                    const absTime = clipStartTime + loopOffset + noteRelTime;

                    if (absTime < totalDuration) {
                        // Probability Check (Fills)
                        // "fill" property is probability (0-1). If missing, default to 1 (always play).
                        const probability = note.fill ?? 1;
                        if (probability >= 1 || Math.random() <= probability) {

                            transport.schedule((time: number) => {
                                if (instrument.triggerAttackRelease) {
                                    instrument.triggerAttackRelease(note.note, note.duration, time, note.velocity);
                                } else if (instrument.triggerAttack) {
                                    instrument.triggerAttack(note.note, time, note.velocity);
                                }
                            }, absTime);
                            events++;
                        }
                    }
                }
                loopOffset += patternDuration;
            }
        });

        return events;
    }

    private static async _preLoadBuffers(project: ProjectData): Promise<Map<string, Tone.ToneAudioBuffer>> {
        const bufferMap = new Map<string, Tone.ToneAudioBuffer>();
        const loadPromises: Promise<void>[] = [];

        console.log('[Offline] Pre-loading samples...');

        Object.values(project.tracks).forEach(track => {
            if (track.instrument.type === 'sampler' && track.instrument.sampleId) {
                const url = this._resolveSampleUrl(track.instrument.sampleId);
                const p = new Promise<void>((resolve) => {
                    const buff = new Tone.ToneAudioBuffer(url, () => {
                        bufferMap.set(track.id, buff);
                        resolve();
                    }, (e) => {
                        console.error(`[Offline] Error loading ${track.id}:`, e);
                        resolve();
                    });
                });
                loadPromises.push(p);
            }
        });

        await Promise.all(loadPromises);
        return bufferMap;
    }

    private static _setupStrip(strip: MixerStrip, data: MixerChannel, dest: Tone.ToneAudioNode, context: any) {
        // Volume
        const volDb = data.volume > 0 ? 20 * Math.log10(data.volume) : -Infinity;
        strip.volume.volume.value = volDb;

        // Pan
        let gainL = 1, gainR = 1;
        if (data.pan > 0) gainL = 1 - data.pan;
        else if (data.pan < 0) gainR = 1 + data.pan;

        strip.panL.gain.value = gainL;
        strip.panR.gain.value = gainR;

        // Mute
        strip.muteGain.gain.value = data.muted ? 0 : 1;

        // Effects Chain
        const effects = data.effects.filter(fx => fx.enabled);
        if (effects.length > 0) {
            console.log(`[Offline] Routing ${data.id}: Found ${effects.length} effects.`);
            effects.forEach(fx => console.log(`  - FX ${fx.type}:`, fx.params));

            strip.input.disconnect();

            const nodes: Tone.ToneAudioNode[] = [];
            effects.forEach(fx => {
                const node = AudioFactory.createEffectNode(fx);
                if (node) {
                    if ((node as any).ready) {
                        context._loadPromises = context._loadPromises || [];
                        context._loadPromises.push((node as any).ready);
                    }
                    nodes.push(node);
                }
            });

            if (nodes.length > 0) {
                strip.input.chain(...nodes, strip.volume);
            } else {
                strip.input.connect(strip.volume);
            }
        }

        strip.muteGain.connect(dest);
    }

    private static _calculateDuration(project: ProjectData): number {
        let maxTime = 0;
        const stepDuration = Tone.Time('16n').toSeconds();

        project.timeline.clips.forEach(clip => {
            if (!clip.patternId) return;

            const clipStart = clip.start * stepDuration;
            const clipDuration = clip.duration * stepDuration;

            const end = clipStart + clipDuration;
            if (end > maxTime) maxTime = end;
        });

        return maxTime + 2;
    }

    private static _resolveSampleUrl(id?: string): string {
        if (!id) return '/samples/kick.wav';
        if (id.includes('/') || id.includes('.')) {
            if (id.startsWith('/')) return id;
            if (id.startsWith('samples/')) return `/${id}`;
            return `/samples/${id}`;
        }
        return `/samples/${id}.wav`;
    }

    private static _bufferToWave(abuffer: AudioBuffer): Blob {
        const numOfChan = abuffer.numberOfChannels;
        const length = abuffer.length * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        const channels = [];
        let i;
        let sample;
        let offset = 0;
        let pos = 0;

        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8);
        setUint32(0x45564157); // "WAVE"

        setUint32(0x20746d66); // "fmt "
        setUint32(16);
        setUint16(1);
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan);
        setUint16(numOfChan * 2);
        setUint16(16);

        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4);

        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < abuffer.length) {
            for (i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][pos]));
                const scale = 0.5 + sample < 0 ? sample * 32768 : sample * 32767;
                sample = Math.trunc(scale);
                view.setInt16(44 + offset, sample, true);
                offset += 2;
            }
            pos++;
        }

        return new Blob([buffer], { type: "audio/wav" });

        function setUint16(data: any) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data: any) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    }
}
