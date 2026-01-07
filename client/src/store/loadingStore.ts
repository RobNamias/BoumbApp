import { create } from 'zustand';

interface LoadingState {
    isLoading: boolean;
    message: string | null;
    setLoading: (active: boolean, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    message: null,
    setLoading: (active, message) => set({
        isLoading: active,
        message: active ? (message || 'Loading...') : null
    })
}));
