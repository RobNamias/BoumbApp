// Cleaned up file content
import { create } from 'zustand';
import audioInstance from '../audio/AudioEngine';
import { useProjectStore } from './projectStore'; // Import ProjectStore

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
    masterVolume: number;
    isMasterMuted: boolean;
    viewMode: 'trigger' | 'volume' | 'fill'; // Added

    setBpm: (bpm: number) => void;
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
    masterVolume: 0.8,
    isMasterMuted: false,
    viewMode: 'trigger', // Default

    setBpm: (bpm) => {
        set({ bpm });
        audioInstance.setBpm(bpm);
        // Sync to Project Store (Critical for Export)
        useProjectStore.getState().setBpm(bpm);
    },
    // Initialize Audio Engine Hook
    _initAudio: () => {
        // onStepChange is now handled by usePlaybackStore and AudioEngine directly.
    },
    setViewMode: (mode) => set({ viewMode: mode }), // Implementation
    setMasterVolume: (volume) => {
        set({ masterVolume: volume });
        // Sync to Project Store (which also handles Audio Engine)
        useProjectStore.getState().updateMixerChannel('master', { volume });
    },
    setMasterMute: (muted) => {
        set({ isMasterMuted: muted });
        // Sync to Project Store
        useProjectStore.getState().updateMixerChannel('master', { muted });
    },

    // New Bus Controls
    juicyVolume: 0.8,
    synthVolume: 0.8,
    setJuicyVolume: (volume) => {
        set({ juicyVolume: volume });
        // Sync to Project Store (Group 1)
        useProjectStore.getState().updateMixerChannel('group-1', { volume });
    },
    setSynthVolume: (volume) => {
        set({ synthVolume: volume });
        // Sync to Project Store (Group 2)
        useProjectStore.getState().updateMixerChannel('group-2', { volume });
    },
}));
