
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JuicyBox from './JuicyBox';
import { vi, describe, it, expect } from 'vitest';

// Mocks
vi.mock('../../../store/projectStore', () => ({
    useProjectStore: () => ({
        project: {
            tracks: {
                't1': { id: 't1', type: 'drums', name: 'Kick', instrument: { sampleId: 'kick' } }
            },
            drumPatterns: {
                'p1': { id: 'p1', name: 'Pattern 1', clips: {} }
            }
        },
        activePatterns: { drums: 'p1' },
        createPattern: vi.fn(),
        setActivePattern: vi.fn(),
        updateTrackVolume: vi.fn(),
        toggleTrackMute: vi.fn(),
        toggleTrackSolo: vi.fn(),
        updateTrackRouting: vi.fn(),
        addNote: vi.fn(),
        removeNote: vi.fn(),
        updateNote: vi.fn()
    })
}));

vi.mock('../../../store/useAppStore', () => ({
    useAppStore: () => ({
        viewMode: 'trigger',
        setViewMode: vi.fn()
    })
}));

vi.mock('../../../hooks/useProjectAudio', () => ({
    useProjectAudio: vi.fn()
}));

vi.mock('./JuicyBoxGrid', () => ({
    default: ({ tracks }: any) => <div data-testid="juicy-grid">Grid with {tracks.length} tracks</div>
}));

vi.mock('./PatternSelector', () => ({
    default: ({ patterns }: any) => <div data-testid="pattern-selector">Selector with {Object.keys(patterns).length} patterns</div>
}));

describe('JuicyBox Component', () => {
    it('renders correctly', () => {
        render(<JuicyBox />);

        // It renders the Grid
        expect(screen.getByTestId('juicy-grid')).toBeInTheDocument();
        expect(screen.getByText('Grid with 1 tracks')).toBeInTheDocument();

        // It renders the Pattern Selector
        expect(screen.getByTestId('pattern-selector')).toBeInTheDocument();
        expect(screen.getByText('Selector with 1 patterns')).toBeInTheDocument();
    });
});
