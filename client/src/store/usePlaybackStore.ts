import { create } from 'zustand'
import audioInstance from '../audio/AudioEngine'

interface PlaybackState {
  playingStep: number
  isPlaying: boolean
  playMode: 'PATTERN' | 'SKYLINE'

  setPlayingStep: (step: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  stop: () => void
  setPlayMode: (mode: 'PATTERN' | 'SKYLINE') => void
  togglePlayMode: () => void
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  playingStep: -1,
  isPlaying: false,
  playMode: 'PATTERN',

  setPlayingStep: (step) => set({ playingStep: step }),
  setIsPlaying: (isPlaying) => {
    set({ isPlaying })
    if (isPlaying) {
      audioInstance.start().catch((err) => console.error('Audio start failed', err))
    } else {
      audioInstance.pause()
    }
  },
  stop: () => {
    set({ isPlaying: false, playingStep: -1 }) // -1 is AudioEngine's default reset state
    audioInstance.stop()
  },
  setPlayMode: (mode) => set({ playMode: mode }),
  togglePlayMode: () => set((state) => ({ playMode: state.playMode === 'SKYLINE' ? 'PATTERN' : 'SKYLINE' })),
}))
