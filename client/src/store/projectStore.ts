import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import audioInstance from '../audio/AudioEngine';
import { MVP_LIMITS } from '../config/constants';


// --- Interfaces (V2 - Track First Architecture) ---

export interface Note {
    time: string;
    note: string;
    duration: string;
    velocity: number;
    fill?: number; // Probability (0-1)
}

// Unified Instrument Config
// Type alias for instrument config types
type InstrumentType = 'sampler' | 'synth';

export interface InstrumentConfig {
    type: InstrumentType;
    // Sampler
    sampleId?: string;
    // Synth
    synthType?: 'fmsynth' | 'polysynth';
    synthParams?: {
        oscillatorType: 'sine' | 'square' | 'sawtooth' | 'triangle';
        envelope: { attack: number; decay: number; sustain: number; release: number; };
    };
    presets?: Record<string, any>;
}

// Unified Global Track
export interface EffectConfig {
    id: string;
    type: 'reverb' | 'delay' | 'distortion' | 'chorus' | 'bitcrusher' | 'autofilter';
    enabled: boolean;
    params: Record<string, number>;
}

// NEW: Mixer Channel (Insert, Group, or Master)
export interface MixerChannel {
    id: string;
    name: string;
    volume: number;
    pan: number;
    muted: boolean;
    solo: boolean;
    effects: EffectConfig[];
    output: string; // "master", "group-1", etc.
}

export interface AudioTrack {
    id: string;
    name: string;
    type: 'drums' | 'melody'; // Helper for UI grouping
    instrument: InstrumentConfig;
    mixerChannelId: string; // Points to an Insert Channel ID
    // Generator/Pre-Mixer Controls
    volume: number; // 0 to 1 (Internal Gain)
    pan: number; // -1 to 1
    muted: boolean;
    solo: boolean;
}

// Unified Pattern (Just Data/Notes)
export interface Pattern {
    id: string;
    name: string;
    duration: number; // steps (usually 32 or 64)
    // Mapping: TrackID -> List of Notes
    clips: Record<string, Note[]>;
}

export interface TimelineClip {
    id: string;
    patternId: string;
    trackId?: string; // Optional: For Pattern connection if needed, but mainly we use patternId
    start: number;
    duration: number;
}

export interface ProjectData {
    id: string; // Internal UUID
    backendId?: number; // Symfony SQL ID (if saved)
    version: number;
    meta: {
        title: string;
        bpm: number;
        swing: number;
        globalKey: {
            root: string;
            scale: string;
        };
    };

    // 1. GLOBAL TRACKS (The Studio)
    // We store all tracks here (Drums 1-6, Synths 1-3...)
    tracks: Record<string, AudioTrack>;

    // 2. MIXER (The Console) - NEW
    mixer: {
        master: MixerChannel;
        groups: Record<string, MixerChannel>; // "group-1" to "group-4"
        inserts: Record<string, MixerChannel>; // "insert-1" to "insert-10"
    };

    // 3. PATTERNS (The Scores)
    drumPatterns: Record<string, Pattern>;
    melodicPatterns: Record<string, Pattern>;

    // 4. ARRANGEMENT
    timeline: {
        clips: TimelineClip[]; // Unified Timeline
    };
}

export interface ProjectState {
    project: ProjectData;
    activePatterns: {
        drums: string | null;
        melody: string | null;
    };

    // Actions
    setGlobalKey: (root: string, scale: string) => void;
    createPattern: (type: 'drums' | 'melody', name: string) => string;
    setActivePattern: (type: 'drums' | 'melody', id: string | null) => void;

    // Track Actions (New)
    addTrack: (type: 'drums' | 'melody', name: string, instrumentType?: 'sampler' | 'synth') => string;

    // Generator Gain Actions
    updateTrackVolume: (trackId: string, volume: number) => void;
    updateTrackPan: (trackId: string, pan: number) => void;
    toggleTrackMute: (trackId: string) => void;
    toggleTrackSolo: (trackId: string) => void;

    // Update Track Routing (change which Insert it goes to)
    updateTrackRouting: (trackId: string, insertId: string) => void;

    updateTrackInstrument: (trackId: string, instrument: Partial<InstrumentConfig>) => void; // New (Sample Swap)

    // Mixer Actions (New)
    updateMixerChannel: (channelId: string, updates: Partial<MixerChannel>) => void;
    addChannelEffect: (channelId: string, effect: Partial<EffectConfig>) => void;
    updateChannelEffect: (channelId: string, effectId: string, updates: Partial<EffectConfig>) => void;
    removeChannelEffect: (channelId: string, effectId: string) => void;

    // Note Actions (Unified)
    addNote: (patternId: string, trackId: string, note: Note) => void;
    updateNote: (patternId: string, trackId: string, oldNote: Note, newNote: Note) => void;
    removeNote: (patternId: string, trackId: string, note: Note) => void;
    setClip: (patternId: string, trackId: string, notes: Note[]) => void;

    // Async Actions
    fetchAllProjects: () => Promise<void>;
    fetchProjectVersions: (projectId: string) => Promise<void>;
    saveProject: () => Promise<void>;
    loadProjectVersion: (versionId: string) => Promise<void>;

    // Timeline Actions
    addTimelineClip: (clip: TimelineClip) => void;
    updateTimelineClip: (clipId: string, updates: Partial<TimelineClip>) => void;
    removeTimelineClip: (clipId: string) => void;

    reset: () => void;
    setProject: (data: ProjectData) => void;
    getActiveClips: (step: number) => TimelineClip[]; // Simplified
}


// --- Initial State (MVP: 6 Drum Tracks + 2 Synths) ---

// Helper to Create Track linked to a Mixer Insert
const createDefaultTrack = (id: string, name: string, type: 'drums' | 'melody', instType: 'sampler' | 'synth', mixerChannelId: string, sampleId?: string): AudioTrack => ({
    id, name, type,
    instrument: {
        type: instType,
        sampleId,
        synthType: 'fmsynth',
        synthParams: { oscillatorType: 'sawtooth', envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 } }
    },
    mixerChannelId,
    volume: 0.8,
    pan: 0,
    muted: false,
    solo: false
});

// Helper to Create Mixer Channel
const createMixerChannel = (id: string, name: string, output: string = 'master'): MixerChannel => ({
    id, name, volume: 0.8, pan: 0, muted: false, solo: false, effects: [], output
});

const DEFAULT_PROJECT: ProjectData = {
    id: 'default',
    version: 3, // Bump version
    meta: {
        title: 'New Project',
        bpm: 120,
        swing: 0,
        globalKey: { root: 'C', scale: 'Major' }
    },
    tracks: {
        // --- 5 DRUM TRACKS (MVP - 808 Kit) ---
        'track-kick': createDefaultTrack('track-kick', 'Kick', 'drums', 'sampler', 'insert-1', 'samples/kits/808/Kick.ogg'),
        'track-snare': createDefaultTrack('track-snare', 'Snare', 'drums', 'sampler', 'insert-2', 'samples/kits/808/Snare.ogg'),
        'track-hhc': createDefaultTrack('track-hhc', 'HiHat C', 'drums', 'sampler', 'insert-3', 'samples/kits/808/ClosedHat.ogg'),
        'track-hho': createDefaultTrack('track-hho', 'HiHat O', 'drums', 'sampler', 'insert-4', 'samples/kits/808/OpenHat.ogg'),
        'track-perc1': createDefaultTrack('track-perc1', 'Crash', 'drums', 'sampler', 'insert-5', 'samples/kits/808/Crash.ogg'),

        // --- 2 MELODY TRACKS ---
        'track-lead': createDefaultTrack('track-lead', 'Lead Synth', 'melody', 'synth', 'insert-9'),
        'track-bass': createDefaultTrack('track-bass', 'Bass Synth', 'melody', 'synth', 'insert-10'),
    },
    mixer: {
        master: createMixerChannel('master', 'Master', ''),
        groups: {
            'group-1': createMixerChannel('group-1', 'CG 1'),
            'group-2': createMixerChannel('group-2', 'CG 2'),
            'group-3': createMixerChannel('group-3', 'CG 3'),
            'group-4': createMixerChannel('group-4', 'CG 4'),
        },
        inserts: {
            'insert-1': createMixerChannel('insert-1', 'Insert 1', 'group-1'),
            'insert-2': createMixerChannel('insert-2', 'Insert 2', 'group-1'),
            'insert-3': createMixerChannel('insert-3', 'Insert 3', 'group-1'),
            'insert-4': createMixerChannel('insert-4', 'Insert 4', 'group-1'),
            'insert-5': createMixerChannel('insert-5', 'Insert 5', 'group-1'),
            'insert-6': createMixerChannel('insert-6', 'Insert 6', 'group-1'),
            'insert-7': createMixerChannel('insert-7', 'Insert 7', 'group-1'),
            'insert-8': createMixerChannel('insert-8', 'Insert 8', 'group-1'),
            'insert-9': createMixerChannel('insert-9', 'Insert 9', 'group-2'),
            'insert-10': createMixerChannel('insert-10', 'Insert 10', 'group-2'),
        }
    },
    drumPatterns: {
        'pattern-d1': {
            id: 'pattern-d1',
            name: 'A',
            duration: 32,
            clips: {
                'track-kick': [
                    { time: '0:0:0', note: 'C4', duration: '16n', velocity: 0.9 },
                    { time: '0:1:0', note: 'C4', duration: '16n', velocity: 0.9 },
                    { time: '0:2:0', note: 'C4', duration: '16n', velocity: 0.9 },
                    { time: '0:3:0', note: 'C4', duration: '16n', velocity: 0.9 },
                ]
            }
        }
    },
    melodicPatterns: {
        'pattern-m1': { id: 'pattern-m1', name: 'A', duration: 64, clips: {} }
    },
    timeline: {
        clips: []
    }
};

// --- Store ---

export const useProjectStore = create<ProjectState>((set, get) => ({
    project: structuredClone(DEFAULT_PROJECT), // Deep copy
    activePatterns: { drums: 'pattern-d1', melody: 'pattern-m1' },

    setGlobalKey: (root, scale) => {
        set((state) => ({
            project: {
                ...state.project,
                meta: {
                    ...state.project.meta,
                    globalKey: { root, scale }
                }
            }
        }));
    },

    createPattern: (type, name) => {
        const id = uuidv4();
        const state = get();

        // Check MVP Limits
        const currentCount = type === 'drums'
            ? Object.keys(state.project.drumPatterns).length
            : Object.keys(state.project.melodicPatterns).length;

        if (currentCount >= MVP_LIMITS.PATTERNS) {
            console.warn(`MVP Limit Reached: Cannot create more than ${MVP_LIMITS.PATTERNS} patterns of type ${type}.`);
            return '';
        }

        // Initialize clips for existing tracks
        // For Drums: We want the pattern to be ready for all current drum tracks
        // For Melody: We might start empty
        const initialClips: Record<string, Note[]> = {};

        if (type === 'drums') {
            Object.values(state.project.tracks)
                .filter(t => t.type === 'drums')
                .forEach(t => { initialClips[t.id] = []; });
        }

        const newPattern: Pattern = {
            id,
            name,
            duration: type === 'drums' ? 32 : 64,
            clips: initialClips
        };

        set((state) => ({
            project: {
                ...state.project,
                [type === 'drums' ? 'drumPatterns' : 'melodicPatterns']: {
                    ...state.project[type === 'drums' ? 'drumPatterns' : 'melodicPatterns'],
                    [id]: newPattern
                }
            }
        }));
        return id;
    },

    setActivePattern: (type, id) => {
        set((state) => ({
            activePatterns: {
                ...state.activePatterns,
                [type]: id
            }
        }));
    },

    // NEW: Add Global Track
    addTrack: (type, name, instrumentType = 'sampler') => {
        const id = uuidv4();
        // Default assignment heuristics (MVP)
        // Drums -> Insert 1-8 rotating? Or just default to Insert 1
        // For now default to Insert 1
        const mixerChannelId = 'insert-1';

        const newTrack: AudioTrack = {
            id,
            name,
            type,
            instrument: {
                type: instrumentType,
                // Defaults
                synthType: 'fmsynth',
                synthParams: {
                    oscillatorType: 'triangle',
                    envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
                }
            },
            mixerChannelId,
            volume: 0.8,
            pan: 0,
            muted: false,
            solo: false
        };

        set((state) => ({
            project: {
                ...state.project,
                tracks: { ...state.project.tracks, [id]: newTrack }
            }
        }));
        return id;
    },

    updateTrackVolume: (trackId, volume) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};
            tracks[trackId] = { ...tracks[trackId], volume };
            audioInstance.setTrackVolume(trackId, volume);
            return { project: { ...state.project, tracks } };
        });
    },

    updateTrackPan: (trackId, pan) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};
            tracks[trackId] = { ...tracks[trackId], pan };
            audioInstance.setTrackPan(trackId, pan);
            return { project: { ...state.project, tracks } };
        });
    },

    toggleTrackMute: (trackId) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};
            const newVal = !tracks[trackId].muted;
            tracks[trackId] = { ...tracks[trackId], muted: newVal };
            audioInstance.setTrackMute(trackId, newVal);
            return { project: { ...state.project, tracks } };
        });
    },

    toggleTrackSolo: (trackId) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};
            const newVal = !tracks[trackId].solo;
            tracks[trackId] = { ...tracks[trackId], solo: newVal };
            audioInstance.setTrackSolo(trackId, newVal);
            return { project: { ...state.project, tracks } };
        });
    },

    updateTrackRouting: (trackId, insertId) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};

            tracks[trackId] = { ...tracks[trackId], mixerChannelId: insertId };

            // Update Audio Engine
            audioInstance.setTrackOutput(trackId, insertId);

            return { project: { ...state.project, tracks } };
        });
    },

    updateMixerChannel: (channelId, channelUpdates) => {
        set((state) => {
            const mixer = { ...state.project.mixer };
            let channel: MixerChannel | undefined;
            let groupType: 'groups' | 'inserts' | 'master' | undefined;

            if (channelId === 'master') {
                channel = mixer.master;
                groupType = 'master';
            } else if (mixer.groups[channelId]) {
                channel = mixer.groups[channelId];
                groupType = 'groups';
            } else if (mixer.inserts[channelId]) {
                channel = mixer.inserts[channelId];
                groupType = 'inserts';
            }

            if (!channel || !groupType) return {};

            // Sync Audio
            if (channelUpdates.volume !== undefined) audioInstance.setChannelVolume(channelId, channelUpdates.volume);
            if (channelUpdates.muted !== undefined) audioInstance.setChannelMute(channelId, channelUpdates.muted);
            if (channelUpdates.solo !== undefined) audioInstance.setChannelSolo(channelId, channelUpdates.solo);
            if (channelUpdates.pan !== undefined) audioInstance.setChannelPan(channelId, channelUpdates.pan);
            if (channelUpdates.output !== undefined) audioInstance.setChannelOutput(channelId, channelUpdates.output);

            const newChannel = { ...channel, ...channelUpdates };

            if (groupType === 'master') mixer.master = newChannel;
            else if (groupType === 'groups') mixer.groups[channelId] = newChannel;
            else if (groupType === 'inserts') mixer.inserts[channelId] = newChannel;

            return { project: { ...state.project, mixer } };
        });
    },

    // NEW: Sample Swap implementation
    updateTrackInstrument: (trackId, instrumentUpdates) => {
        set((state) => {
            const tracks = { ...state.project.tracks };
            if (!tracks[trackId]) return {};

            // Merge Instrument config
            const newInstrument = {
                ...tracks[trackId].instrument,
                ...instrumentUpdates,
                // Deep merge synth params if needed
                synthParams: {
                    ...tracks[trackId].instrument.synthParams,
                    ...(instrumentUpdates.synthParams || {})
                } as NonNullable<InstrumentConfig['synthParams']>
            };

            tracks[trackId] = {
                ...tracks[trackId],
                instrument: newInstrument
            };

            // Trigger Audio Engine Update for Synth Params
            if (newInstrument.type === 'synth') {
                audioInstance.updateTrackInstrumentParams(trackId, newInstrument);
            }

            return { project: { ...state.project, tracks } };
        });
    },

    addChannelEffect: (channelId, effect) => {
        set((state) => {
            const mixer = { ...state.project.mixer };
            let channel: MixerChannel | undefined;
            let groupType: 'groups' | 'inserts' | 'master' | undefined;

            if (channelId === 'master') { channel = mixer.master; groupType = 'master'; }
            else if (mixer.groups[channelId]) { channel = mixer.groups[channelId]; groupType = 'groups'; }
            else if (mixer.inserts[channelId]) { channel = mixer.inserts[channelId]; groupType = 'inserts'; }

            if (!channel || !groupType) return {};

            let initialParams = effect.params || {};
            if (Object.keys(initialParams).length === 0) {
                const type = effect.type || 'reverb';
                if (type === 'reverb') initialParams = { decay: 1.5, preDelay: 0.01, mix: 0.5 };
                else if (type === 'delay') initialParams = { time: 0.25, feedback: 0.5, mix: 0.5 };
                else if (type === 'distortion') initialParams = { amount: 0.4, mix: 0.5 };
                else if (type === 'chorus') initialParams = { frequency: 4, delayTime: 2.5, depth: 0.5, mix: 0.5 };
                else if (type === 'bitcrusher') initialParams = { bits: 4, mix: 0.5 };
                else if (type === 'autofilter') initialParams = { frequency: 1, depth: 0.5, baseFrequency: 200, mix: 0.5 };
            }

            const newEffect: EffectConfig = {
                id: uuidv4(),
                type: effect.type || 'reverb',
                enabled: effect.enabled ?? true,
                params: initialParams
            };

            const newChannel = {
                ...channel,
                effects: [...channel.effects, newEffect]
            };

            if (groupType === 'master') mixer.master = newChannel;
            else if (groupType === 'groups') mixer.groups[channelId] = newChannel;
            else if (groupType === 'inserts') mixer.inserts[channelId] = newChannel;

            // TODO: Trigger Audio Engine Rebuild
            audioInstance.rebuildChannelChain(channelId, newChannel.effects);

            return { project: { ...state.project, mixer } };
        });
    },

    updateChannelEffect: (channelId, effectId, updates) => {
        set((state) => {
            const mixer = { ...state.project.mixer };
            let channel: MixerChannel | undefined;
            let groupType: 'groups' | 'inserts' | 'master' | undefined;

            if (channelId === 'master') { channel = mixer.master; groupType = 'master'; }
            else if (mixer.groups[channelId]) { channel = mixer.groups[channelId]; groupType = 'groups'; }
            else if (mixer.inserts[channelId]) { channel = mixer.inserts[channelId]; groupType = 'inserts'; }

            if (!channel || !groupType) return {};

            const newEffects = channel.effects.map(fx => {
                if (fx.id !== effectId) return fx;

                // Prevent param pollution: If type changes, replace params entirely.
                // Otherwise, merge new params into existing ones.
                const isTypeChange = updates.type && updates.type !== fx.type;
                let newParams = fx.params;

                if (updates.params) {
                    if (isTypeChange) {
                        newParams = updates.params; // Replace
                    } else {
                        newParams = { ...fx.params, ...updates.params }; // Merge
                    }
                } else if (isTypeChange) {
                    // Type changed but no params provided? Should probably empty it or keep it?
                    // Safe to default to empty if type changed without params
                    newParams = {};
                }

                return { ...fx, ...updates, params: newParams };
            });

            const newChannel = { ...channel, effects: newEffects };

            if (groupType === 'master') mixer.master = newChannel;
            else if (groupType === 'groups') mixer.groups[channelId] = newChannel;
            else if (groupType === 'inserts') mixer.inserts[channelId] = newChannel;

            // TODO: Update Audio Engine
            audioInstance.rebuildChannelChain(channelId, newChannel.effects);

            return { project: { ...state.project, mixer } };
        });
    },

    removeChannelEffect: (channelId, effectId) => {
        set((state) => {
            const mixer = { ...state.project.mixer };
            let channel: MixerChannel | undefined;
            let groupType: 'groups' | 'inserts' | 'master' | undefined;

            if (channelId === 'master') { channel = mixer.master; groupType = 'master'; }
            else if (mixer.groups[channelId]) { channel = mixer.groups[channelId]; groupType = 'groups'; }
            else if (mixer.inserts[channelId]) { channel = mixer.inserts[channelId]; groupType = 'inserts'; }

            if (!channel || !groupType) return {};

            const newEffects = channel.effects.filter(fx => fx.id !== effectId);

            const newChannel = { ...channel, effects: newEffects };

            if (groupType === 'master') mixer.master = newChannel;
            else if (groupType === 'groups') mixer.groups[channelId] = newChannel;
            else if (groupType === 'inserts') mixer.inserts[channelId] = newChannel;

            // TODO: Rebuild Chain
            audioInstance.rebuildChannelChain(channelId, newChannel.effects);

            return { project: { ...state.project, mixer } };
        });
    },

    addNote: (patternId, trackId, note) => {
        set((state) => {
            // Determine type by checking which bank provided the pattern
            const isDrum = !!state.project.drumPatterns[patternId];
            const patternsKey = isDrum ? 'drumPatterns' : 'melodicPatterns';

            const patterns = { ...state.project[patternsKey] };
            const pattern = patterns[patternId];
            if (!pattern) return {};

            const clips = { ...pattern.clips };
            const trackNotes = clips[trackId] || [];

            clips[trackId] = [...trackNotes, note];

            patterns[patternId] = { ...pattern, clips };

            // Sync Audio (Live) if this is the active pattern
            if ((isDrum && state.activePatterns.drums === patternId) || (!isDrum && state.activePatterns.melody === patternId)) {
                audioInstance.setTrackClips(trackId, clips[trackId], isDrum ? 32 : 64);
            }

            return {
                project: {
                    ...state.project,
                    [patternsKey]: patterns
                }
            };
        });
    },

    updateNote: (patternId, trackId, oldNote, newNote) => {
        set((state) => {
            const isDrum = !!state.project.drumPatterns[patternId];
            const patternsKey = isDrum ? 'drumPatterns' : 'melodicPatterns';

            const patterns = { ...state.project[patternsKey] };
            const pattern = patterns[patternId];
            if (!pattern) return {};

            const clips = { ...pattern.clips };
            const trackNotes = clips[trackId] || [];

            clips[trackId] = trackNotes.map(n =>
                (n.time === oldNote.time && n.note === oldNote.note) ? newNote : n
            );

            patterns[patternId] = { ...pattern, clips };

            // Sync Audio
            if ((isDrum && state.activePatterns.drums === patternId) || (!isDrum && state.activePatterns.melody === patternId)) {
                audioInstance.setTrackClips(trackId, clips[trackId], isDrum ? 32 : 64);
            }

            return { project: { ...state.project, [patternsKey]: patterns } };
        });
    },

    removeNote: (patternId, trackId, note) => {
        set((state) => {
            const isDrum = !!state.project.drumPatterns[patternId];
            const patternsKey = isDrum ? 'drumPatterns' : 'melodicPatterns';

            const patterns = { ...state.project[patternsKey] };
            const pattern = patterns[patternId];
            if (!pattern) return {};

            const clips = { ...pattern.clips };
            const trackNotes = clips[trackId] || [];

            clips[trackId] = trackNotes.filter(n =>
                !(n.time === note.time && n.note === note.note)
            );

            patterns[patternId] = { ...pattern, clips };

            // Sync Audio
            if ((isDrum && state.activePatterns.drums === patternId) || (!isDrum && state.activePatterns.melody === patternId)) {
                audioInstance.setTrackClips(trackId, clips[trackId], isDrum ? 32 : 64);
            }

            return { project: { ...state.project, [patternsKey]: patterns } };
        });
    },

    setClip: (patternId, trackId, notes) => {
        set((state) => {
            const isDrum = !!state.project.drumPatterns[patternId];
            const patternsKey = isDrum ? 'drumPatterns' : 'melodicPatterns';

            const patterns = { ...state.project[patternsKey] };
            const pattern = patterns[patternId];
            if (!pattern) return {};

            const clips = { ...pattern.clips };
            clips[trackId] = notes;

            patterns[patternId] = { ...pattern, clips };
            return { project: { ...state.project, [patternsKey]: patterns } };
        });
    },

    // --- Timeline Unified Actions ---

    addTimelineClip: (clip) => {
        set((state) => ({
            project: {
                ...state.project,
                timeline: {
                    clips: [...state.project.timeline.clips, clip]
                }
            }
        }));
    },

    updateTimelineClip: (clipId, updates) => {
        set((state) => ({
            project: {
                ...state.project,
                timeline: {
                    clips: state.project.timeline.clips.map(c =>
                        c.id === clipId ? { ...c, ...updates } : c
                    )
                }
            }
        }));
    },

    removeTimelineClip: (clipId) => {
        set((state) => ({
            project: {
                ...state.project,
                timeline: {
                    clips: state.project.timeline.clips.filter(c => c.id !== clipId)
                }
            }
        }));
    },

    // --- Async Actions ---

    fetchAllProjects: async () => {
        try {
            const { projectService } = await import('../services/projectService');
            const data = await projectService.getAllProjects();
            // @ts-ignore
            set({ savedProjects: data });
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    },

    fetchProjectVersions: async (projectId: string) => {
        console.log("[Lite] Fetch versions for", projectId);
    },

    saveProject: async () => {
        const state = get();
        try {
            const { projectService } = await import('../services/projectService');
            const project = state.project;
            let projectId = project.id;

            if (projectId === 'default') {
                // Create new
                const newProj = await projectService.createProject(project.meta.title, project);
                projectId = newProj.id;

                // Update ID and Meta
                set((s) => ({
                    project: {
                        ...s.project,
                        id: projectId,
                        // Update version if needed
                    }
                }));
            } else {
                await projectService.saveVersion(projectId, project);
            }
            console.log("Project Saved! ID:", projectId);
        } catch (e) {
            console.error("Save Failed", e);
        }
    },

    loadProjectVersion: async (versionId: string) => {
        try {
            const { projectService } = await import('../services/projectService');
            // In Lite mode, we trust versionId is either a project ID or version ID we can resolve
            const version = await projectService.getLatestVersion(versionId);
            if (version && version.data) {
                get().setProject(version.data);
            }
        } catch (e) {
            console.error("Load Failed", e);
        }
    },

    reset: () => {
        audioInstance.reset(); // Stop and Clear Audio Engine
        set({
            project: structuredClone(DEFAULT_PROJECT),
            activePatterns: { drums: 'pattern-d1', melody: 'pattern-m1' }
        });
    },

    setProject: (data) => {
        audioInstance.reset(); // Stop and Clear Audio Engine before loading new data
        set({ project: data });
    },

    getActiveClips: (step) => {
        const state = get();
        // Return unified clips relevant for this step
        return state.project.timeline.clips.filter(
            clip => step >= clip.start && step < (clip.start + clip.duration)
        );
    }
}));

