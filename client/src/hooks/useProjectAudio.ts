import { useEffect, useRef } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAppStore } from '../store/useAppStore';
import audioInstance from '../audio/AudioEngine';
import * as Tone from 'tone';

/**
 * Syncs the ProjectStore with the AudioEngine.
 * Handles:
 * 1. Global Track Configuration (Creation, Vol, Pan...)
 * 2. Active Pattern Loading (into Tone.Parts)
 * 3. Transport Control (Play/Pause)
 * 4. UI Playhead Update
 */
export const useProjectAudio = (onStep?: (step: number) => void) => {
    const { project, activePatterns } = useProjectStore();
    const { playMode } = useAppStore(); // 'PATTERN' | 'SONG' (Legacy naming: 'SKYLINE'?)

    // Refs for Loop Callback (to avoid stale closures if we used a callback)
    const onStepRef = useRef(onStep);

    useEffect(() => {
        onStepRef.current = onStep;
    }, [onStep]);

    // 1. Sync Global Tracks (Structure & Mixer)
    // Minimizes re-runs by checking basic equality or relying on AudioEngine idempotency
    useEffect(() => {
        Object.values(project.tracks).forEach(track => {
            audioInstance.syncTrack({
                id: track.id,
                type: track.type === 'drums' ? 'sampler' : 'synth', // Helper mapping
                // For synth, type is 'synth'. For drums, it's 'sampler'.
                // But wait, AudioTrack interface has `instrument.type` which is 'sampler'|'synth'.
                // So we can use that directly.
                instrument: track.instrument,
                mixerChannelId: track.mixerChannelId
            });

            // 1a. Sync Track Parameters (Vol, Pan, Mute, Solo)
            // Essential for applying values on Project Load
            audioInstance.setTrackVolume(track.id, track.volume);
            audioInstance.setTrackPan(track.id, track.pan);
            audioInstance.setTrackMute(track.id, track.muted);
            audioInstance.setTrackSolo(track.id, track.solo);
        });
    }, [project.tracks]);
    // Optimization: project.tracks changes only on structure change, mixer updates might trigger this too.
    // AudioEngine.syncTrack handles updates efficiently.

    // 1b. Sync Mixer State (Routing, Vol, Mute) - Vital for initial load!
    useEffect(() => {
        if (!project.mixer) return;

        const m = project.mixer;

        // Master
        audioInstance.setChannelVolume('master', m.master.volume);
        audioInstance.setChannelMute('master', m.master.muted);
        audioInstance.rebuildChannelChain('master', m.master.effects);

        // Groups
        Object.values(m.groups).forEach(g => {
            audioInstance.setChannelVolume(g.id, g.volume);
            audioInstance.setChannelMute(g.id, g.muted);
            audioInstance.setChannelOutput(g.id, g.output);
            audioInstance.rebuildChannelChain(g.id, g.effects);
        });
        // Inserts
        Object.values(m.inserts).forEach(i => {
            audioInstance.setChannelVolume(i.id, i.volume);
            audioInstance.setChannelMute(i.id, i.muted);
            audioInstance.setChannelOutput(i.id, i.output);
            audioInstance.rebuildChannelChain(i.id, i.effects);
        });
    }, [project.mixer]);

    // 2. Sync Active Patterns (Playback Data)
    useEffect(() => {
        // console.log(`[useProjectAudio] Sync Effect Triggered. Mode: ${playMode}, Tracks: ${Object.keys(project.tracks).length}`);

        if (playMode === 'PATTERN') {
            // Load Drums
            const drumPid = activePatterns.drums;
            // Iterate ALL drum tracks to ensure we clear those not in the pattern (or if pattern is null)
            Object.values(project.tracks).filter(t => t.type === 'drums').forEach(track => {
                let notes: any[] = [];
                if (drumPid && project.drumPatterns[drumPid] && project.drumPatterns[drumPid].clips[track.id]) {
                    notes = project.drumPatterns[drumPid].clips[track.id];
                }
                audioInstance.setTrackClips(track.id, notes, 32); // Default 32 for drums
            });

            // Load Melody
            const melPid = activePatterns.melody;
            Object.values(project.tracks).filter(t => t.type === 'melody').forEach(track => {
                let notes: any[] = [];
                if (melPid && project.melodicPatterns[melPid] && project.melodicPatterns[melPid].clips[track.id]) {
                    notes = project.melodicPatterns[melPid].clips[track.id];
                }
                audioInstance.setTrackClips(track.id, notes, 64); // Default 64 for melody
            });

            // Loop settings for Pattern Mode
            Tone.getTransport().loop = true;
            Tone.getTransport().loopStart = 0;
            Tone.getTransport().loopEnd = "2:0:0"; // Default, preferably max pattern duration
        } else {
            // SONG MODE
            const songEvents: Record<string, any[]> = {};

            // 1. Initialize Event Lists for all tracks
            Object.keys(project.tracks).forEach(tid => { songEvents[tid] = []; });

            // 2. Iterate Timeline
            project.timeline.clips.forEach(clip => {
                const isDrum = !!project.drumPatterns[clip.patternId];
                const pattern = isDrum ? project.drumPatterns[clip.patternId] : project.melodicPatterns[clip.patternId];
                if (!pattern) {
                    console.warn(`[useProjectAudio] Pattern not found for clip ${clip.id} (PatternID: ${clip.patternId})`);
                    return;
                }

                // For each track, if it has notes in this pattern, add them with offset
                Object.keys(pattern.clips).forEach(trackId => {
                    if (!songEvents[trackId]) return;

                    const patternNotes = pattern.clips[trackId];
                    const offsetSteps = clip.start; // Clip start in 16th steps

                    patternNotes.forEach(note => {
                        // Parse note time (e.g. "0:0:0" -> steps)
                        // Simple parse: "bar:beat:six"
                        const [bar, beat, six] = note.time.split(':').map(Number);
                        const noteSteps = (bar * 16) + (beat * 4) + six;

                        let totalSteps = offsetSteps + noteSteps;

                        // Sanitize: Prevent negative time (RangeError) and float drift
                        if (totalSteps < 0) totalSteps = 0;
                        totalSteps = Math.round(totalSteps);

                        // Convert back to "bar:beat:six"
                        const absBar = Math.floor(totalSteps / 16);
                        const rem = totalSteps % 16;
                        const absBeat = Math.floor(rem / 4);
                        const absSix = rem % 4;

                        songEvents[trackId].push({
                            ...note,
                            time: `${absBar}:${absBeat}:${absSix}`
                        });
                    });
                });
            });

            // 3. Schedule on AudioEngine
            console.log(`[useProjectAudio] Scheduling Song Mode. Clips: ${project.timeline.clips.length}`);
            Object.keys(songEvents).forEach(trackId => {
                const events = songEvents[trackId];
                if (events.length > 0) {
                    console.log(`[useProjectAudio] Track ${trackId}: Scheduling ${events.length} events. Range: ${events[0].time} to ${events[events.length - 1].time}`);
                }
                audioInstance.setTrackClips(trackId, events);
            });

            // Loop the whole song? Or just play once? 
            // Usually Song Mode plays once or loops the defined song region.
            // Let's find max time.
            let maxSteps = 0;
            project.timeline.clips.forEach(c => {
                const end = c.start + c.duration;
                if (end > maxSteps) maxSteps = end;
            });

            // Fix Loop End Calculation
            // 32 steps = "2:0:0"
            const bars = Math.ceil(maxSteps / 16);
            const loopEnd = `${bars}:0:0`;

            console.log(`[useProjectAudio] Song Mode: MaxSteps=${maxSteps}, LoopEnd=${loopEnd}`);

            Tone.getTransport().loop = true; // Loop song for now
            Tone.getTransport().loopStart = 0;
            Tone.getTransport().loopEnd = loopEnd;
        }
    }, [project.drumPatterns, project.melodicPatterns, activePatterns, playMode, project.tracks, project.timeline]);

    // 3. UI Loop (Decoupled from Audio)
    useEffect(() => {
        const loopId = Tone.getTransport().scheduleRepeat(() => {
            // Calculate 16th step (0-31 or global)

            // Better: use ticks
            const ticks = Tone.getTransport().ticks;
            const sixteenths = Math.floor(ticks / (Tone.getTransport().PPQ / 4));

            if (onStepRef.current) {
                // Pass global sixteenths in Song Mode? 
                // Or modulo loop length?
                // For now, pass raw sixteenths, let UI handle display
                onStepRef.current(sixteenths);
            }
        }, "16n");

        return () => {
            Tone.getTransport().clear(loopId);
        };
    }, []);

    return null; // Logic only hook
};
