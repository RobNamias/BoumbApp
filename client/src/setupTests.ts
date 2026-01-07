import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global Tone.js Mock to prevent Web Audio Context errors in JSDOM
vi.mock('tone', async () => {
    return {
        start: vi.fn().mockResolvedValue(undefined),
        getTransport: vi.fn(() => ({
            start: vi.fn(),
            stop: vi.fn(),
            pause: vi.fn(),
            scheduleRepeat: vi.fn(),
            cancel: vi.fn(),
            seconds: 0,
            bpm: { value: 120 }
        })),
        getDestination: vi.fn(() => ({
            volume: { value: 0, rampTo: vi.fn() },
            mute: false
        })),
        gainToDb: (val: number) => val, // Simple pass-through
        Channel: vi.fn().mockImplementation(function () {
            return {
                toDestination: vi.fn().mockReturnThis(),
                connect: vi.fn().mockReturnThis(),
                volume: { value: 0, rampTo: vi.fn() },
                pan: { value: 0, rampTo: vi.fn() },
                mute: false,
                solo: false,
                dispose: vi.fn()
            };
        }),
        Sampler: vi.fn().mockImplementation(function () {
            return {
                toDestination: vi.fn().mockReturnThis(),
                connect: vi.fn().mockReturnThis(),
                triggerAttack: vi.fn(),
                dispose: vi.fn()
            };
        }),
        PolySynth: vi.fn().mockImplementation(function () {
            return {
                toDestination: vi.fn().mockReturnThis(),
                connect: vi.fn().mockReturnThis(),
                triggerAttack: vi.fn(),
                triggerAttackRelease: vi.fn(),
                releaseAll: vi.fn(), // Added releaseAll
                dispose: vi.fn()
            };
        }),
        Part: vi.fn().mockImplementation(function () {
            return {
                start: vi.fn(),
                stop: vi.fn(),
                dispose: vi.fn()
            };
        }),
        Synth: vi.fn()
    };
});
