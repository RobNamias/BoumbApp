
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SynthLab from './SynthLab';
import { vi, describe, it, expect } from 'vitest';

// Mocks
vi.mock('../../../store/projectStore', () => ({
    useProjectStore: () => ({
        project: {
            tracks: {
                's1': { id: 's1', type: 'melody', name: 'Lead Synth', instrument: { osc: 'sawtooth' } }
            },
            melodicPatterns: {
                'p1': { id: 'p1', name: 'Pattern 1', clips: {} }
            }
        },
        activePatterns: { melody: 'p1' },
        createPattern: vi.fn(),
        setActivePattern: vi.fn(),
        addTrack: vi.fn(),
        updateTrackVolume: vi.fn(),
        toggleTrackMute: vi.fn(),
        updateTrackRouting: vi.fn(),
        setClip: vi.fn()
    })
}));

vi.mock('../../../store/useAppStore', () => ({
    useAppStore: () => ({
        isPlaying: false,
        playingStep: 0
    })
}));

vi.mock('../../../hooks/useProjectAudio', () => ({
    useProjectAudio: vi.fn()
}));

vi.mock('../JuicyBox/PatternSelector', () => ({
    default: ({ activePatternId }: any) => <div data-testid="pattern-selector">Selector (Active: {activePatternId})</div>
}));

vi.mock('../PianoRoll/PianoRoll', () => ({
    default: ({ patternId }: any) => <div data-testid="piano-roll">PianoRoll for {patternId}</div>
}));

vi.mock('../SynthPanel/SynthPanel', () => ({
    default: ({ trackId }: any) => <div data-testid="synth-panel">SynthPanel for {trackId}</div>
}));

vi.mock('../AIComposer/AIComposerPopover', () => ({
    default: () => <div data-testid="ai-composer">AI Composer</div>
}));

vi.mock('lucide-react', () => ({
    Plus: () => <div data-testid="icon-plus">Plus</div>,
    Sparkles: () => <div data-testid="icon-sparkles">Sparkles</div>,
    ChevronRight: () => <div data-testid="icon-chevron-right">ChevronRight</div>,
    FlaskConical: () => <div data-testid="icon-flask">Flask</div>
}));

vi.mock('../../atoms/Knob', () => ({ default: () => <div>Knob</div> }));
vi.mock('../../atoms/Led', () => ({ default: () => <div>Led</div> }));
vi.mock('../../atoms/DragInput', () => ({ default: () => <div>DragInput</div> }));

vi.mock('../../../styles/modules/SynthLab.module.scss', () => ({
    default: {
        synthLabContainer: 'synthLabContainer',
        toolbar: 'toolbar',
        title: 'title',
        accordionTrack: 'accordionTrack',
        expanded: 'expanded'
    }
}));

describe('SynthLab Component', () => {
    it('renders correctly', () => {
        render(<SynthLab />);

        // It renders the title
        expect(screen.getByText('🎹 SynthLab')).toBeInTheDocument();

        // It renders the Pattern Selector
        expect(screen.getByTestId('pattern-selector')).toHaveTextContent('Selector (Active: p1)');

        // It renders the PianoRoll
        expect(screen.getByTestId('piano-roll')).toHaveTextContent('PianoRoll for p1');

        // It renders the SynthPanel (default track might be selected via effect, typically s1)
        expect(screen.getByTestId('synth-panel')).toHaveTextContent('SynthPanel for s1');
    });
});
