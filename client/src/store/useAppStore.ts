// Cleaned up file content
import { create } from 'zustand';
import audioInstance from '../audio/AudioEngine';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AppState {
    // User & Theme State
    user: User | null;
    isAuthenticated: boolean;
    theme: 'dark' | 'light';
    login: (userData: User) => void;
    logout: () => void;
    toggleTheme: () => void;

    // Audio State
    bpm: number;
    isPlaying: boolean;
    playingStep: number;
    masterVolume: number;
    isMasterMuted: boolean;
    playMode: 'PATTERN' | 'SKYLINE';
    viewMode: 'trigger' | 'volume' | 'fill'; // Added

    togglePlayMode: () => void;
    setBpm: (bpm: number) => void;
    setIsPlaying: (isPlaying: boolean) => Promise<void> | void;
    stop: () => void;
    setPlayingStep: (step: number) => void;
    setMasterVolume: (volume: number) => void;
    setMasterMute: (muted: boolean) => void;
    setViewMode: (mode: 'trigger' | 'volume' | 'fill') => void;

    // Bus Controls
    juicyVolume: number;
    synthVolume: number;
    setJuicyVolume: (volume: number) => void;
    setSynthVolume: (volume: number) => void;

    // Internal
    _initAudio: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    // User & Theme Initial State
    user: null,
    isAuthenticated: false,
    theme: 'dark',
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

    // Audio Initial State
    bpm: 120,
    isPlaying: false,
    playingStep: -1,
    masterVolume: 0.8,
    isMasterMuted: false,
    playMode: 'PATTERN',
    viewMode: 'trigger', // Default

    setBpm: (bpm) => {
        set({ bpm });
        audioInstance.setBpm(bpm);
    },
    // Initialize Audio Engine Hook
    _initAudio: () => {
        audioInstance.onStepChange = (step) => {
            set({ playingStep: step });
        };
    },
    togglePlayMode: () => set((state) => {
        const newMode = state.playMode === 'SKYLINE' ? 'PATTERN' : 'SKYLINE';
        if (newMode === 'PATTERN') {
            audioInstance.setLoop(0, 2, true); // 32 steps = 2 bars loop
        } else {
            audioInstance.setLoop(0, 100, false); // Disable loop for Song Mode
        }
        return { playMode: newMode };
    }),
    setViewMode: (mode) => set({ viewMode: mode }), // Implementation
    setIsPlaying: async (isPlaying) => {
        try {
            if (isPlaying) {
                await audioInstance.start();
            } else {
                audioInstance.pause();
            }
            set({ isPlaying });
        } catch (error) {
            console.error("Failed to toggle playback", error);
            set({ isPlaying: false });
        }
    },
    stop: () => {
        audioInstance.stop();
        set({ isPlaying: false, playingStep: 0 });
    },
    setPlayingStep: (step) => set({ playingStep: step }),
    setMasterVolume: (volume) => {
        set({ masterVolume: volume });
        audioInstance.setChannelVolume('master', volume);
    },
    setMasterMute: (muted) => {
        set({ isMasterMuted: muted });
        audioInstance.setChannelMute('master', muted);
    },

    // New Bus Controls
    juicyVolume: 0.8,
    synthVolume: 0.8,
    setJuicyVolume: (volume) => {
        set({ juicyVolume: volume });
        audioInstance.setChannelVolume('group-1', volume); // Map Juicy to Group 1
    },
    setSynthVolume: (volume) => {
        set({ synthVolume: volume });
        audioInstance.setChannelVolume('group-2', volume); // Map Synth to Group 2
    },
}));
