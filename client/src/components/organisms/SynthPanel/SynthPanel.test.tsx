import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SynthPanel from './SynthPanel';
import { useProjectStore } from '../../../store/projectStore';

// Mock ADSRGraph to avoid canvas issues in test environment
vi.mock('../../molecules/ADSRGraph', () => ({
    default: () => <div data-testid="adsr-graph">Graph</div>
}));

// Mock Store
const updateSynthParamsMock = vi.fn();
const tracksMock = {
    'track-99': {
        id: 'track-99',
        name: 'Synth Track',
        instrument: {
            type: 'synth',
            synthType: 'fmsynth',
            synthParams: {
                oscillatorType: 'triangle',
                envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 }
            }
        },
        mixer: {}
    }
};

vi.mock('../../../store/projectStore', () => ({
    useProjectStore: vi.fn(() => ({
        project: {
            melodicTracks: tracksMock
        },
        updateSynthParams: updateSynthParamsMock
    }))
}));

describe('SynthPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset store mock implementation if needed
        (useProjectStore as any).mockImplementation(() => ({
            project: {
                melodicTracks: tracksMock
            },
            updateSynthParams: updateSynthParamsMock
        }));
    });

    it('renders correctly with oscillator and envelope controls', () => {
        render(<SynthPanel trackId="track-99" />);

        expect(screen.getByText('OSC 1')).toBeInTheDocument();
        // Envelope title is gone, but we can check for knobs or the graph
        expect(screen.getByTestId('adsr-graph')).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('D')).toBeInTheDocument();
    });

    it('displays warning if track is not found or not a synth', () => {
        (useProjectStore as any).mockReturnValue({
            project: { melodicTracks: {} },
            updateSynthParams: updateSynthParamsMock
        });

        render(<SynthPanel trackId="track-missing" />);
        expect(screen.getByText('No Synth Track Selected')).toBeInTheDocument();
    });

    it('calls updateSynthParams when Oscillator is changed', () => {
        render(<SynthPanel trackId="track-99" />);

        // Waveform selector uses Buttons now, not a select
        const squareBtn = screen.getByText('Sqr');
        fireEvent.click(squareBtn);

        expect(updateSynthParamsMock).toHaveBeenCalledWith('track-99', { oscillatorType: 'square' });
    });
});
