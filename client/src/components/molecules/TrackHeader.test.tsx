import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrackHeader, { type Track } from './TrackHeader';

// Mock Track Data
const mockTrack: Track = {
    id: "1",
    name: "Kick",
    sample: "kick.wav",
    volume: 0.8,
    pan: 0,
    solo: false,
    muted: false,
    output: "ci1",
    steps: []
};

// Mock useTracksStore
const mockSetVolume = vi.fn();
const mockSetMute = vi.fn();
const mockSetSolo = vi.fn();

vi.mock('../../store/useTracksStore', () => ({
    useTracksStore: () => ({
        tracks: {}, // Default empty state, component falls back to props or defaults
        setVolume: mockSetVolume,
        setMute: mockSetMute,
        setSolo: mockSetSolo
    })
}));

describe('TrackHeader Molecule', () => {
    // Basic Render Test
    it('renders track name', () => {
        render(<TrackHeader track={mockTrack} />);
        expect(screen.getByText("Kick")).toBeInTheDocument();
    });

    it('calls setMute on led click', () => {
        render(<TrackHeader track={mockTrack} />);

        // Find the wrapper div for mute LED based on title (Note: title reflects state)
        // Initial mockTrack.muted is false, so title is "Mute"
        const muteControl = screen.getByTitle("Mute");
        fireEvent.click(muteControl);

        // Expect store action with track ID and NEW state (inverted)
        expect(mockSetMute).toHaveBeenCalledWith(mockTrack.id, true);
    });

    it('calls setSolo on button click', () => {
        render(<TrackHeader track={mockTrack} />);

        const soloBtn = screen.getByText("S");
        fireEvent.click(soloBtn);

        expect(mockSetSolo).toHaveBeenCalledWith(mockTrack.id, true);
    });

    it('calls setVolume via knob', () => {
        render(<TrackHeader track={mockTrack} />);

        const knob = screen.getByRole('slider', { name: "Volume" });
        fireEvent.keyDown(knob, { key: 'ArrowUp' });

        // Knob handles 0-100, store expects 0-1
        // Initial 0.8 (80%). Up Arrow -> 81% -> 0.81
        expect(mockSetVolume).toHaveBeenCalledWith(mockTrack.id, 0.81);
    });
});
