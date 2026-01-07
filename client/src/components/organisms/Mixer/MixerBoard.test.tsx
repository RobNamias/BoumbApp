
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MixerBoard from './MixerBoard';
import { vi, describe, it, expect } from 'vitest';

// Mocks
vi.mock('../../molecules/ChannelStrip', () => ({
    default: ({ label, onSelect, isSelected }: any) => (
        <div
            data-testid={`channel-strip-${label}`}
            onClick={onSelect}
            data-selected={isSelected}
        >
            {label}
        </div>
    )
}));

vi.mock('./FXInspector', () => ({
    default: ({ channelId }: any) => <div data-testid="fx-inspector">{channelId ? `Inspector for ${channelId}` : 'No Channel Selected'}</div>
}));

vi.mock('../../atoms/SpectrumAnalyzer', () => ({
    default: () => <div data-testid="spectrum-analyzer">SpectrumAnalyzer</div>
}));

vi.mock('../../../styles/modules/MixerBoard.module.scss', () => ({
    default: {
        mixerBoard: 'mixerBoard',
        masterSection: 'masterSection',
        channelsContainer: 'channelsContainer',
        inspectorSection: 'inspectorSection',
        collapsed: 'collapsed'
    }
}));

describe('MixerBoard Component', () => {

    it('renders Master section correctly', () => {
        render(<MixerBoard />);
        expect(screen.getByText(/The Sauce/i)).toBeInTheDocument();
        expect(screen.getByTestId('spectrum-analyzer')).toBeInTheDocument();
        expect(screen.getByTestId('channel-strip-Master')).toBeInTheDocument();
    });

    it('renders Group Channels (CG 1-4)', () => {
        render(<MixerBoard />);
        ['CG 1', 'CG 2', 'CG 3', 'CG 4'].forEach(label => {
            expect(screen.getByTestId(`channel-strip-${label}`)).toBeInTheDocument();
        });
    });

    it('renders Insert Channels (CI 1-10)', () => {
        render(<MixerBoard />);
        for (let i = 1; i <= 10; i++) {
            expect(screen.getByTestId(`channel-strip-CI ${i}`)).toBeInTheDocument();
        }
    });

    it('handles channel selection and shows FXInspector', () => {
        render(<MixerBoard />);

        // Initially no channel selected (or whatever default behavior, code says null)
        // Inspector listens to channelId
        // In the mock, we output "Inspector for {channelId}"

        // Select Master
        fireEvent.click(screen.getByTestId('channel-strip-Master'));
        expect(screen.getByTestId('channel-strip-Master')).toHaveAttribute('data-selected', 'true');
        expect(screen.getByText('Inspector for master')).toBeInTheDocument();

        // Select CG 1
        fireEvent.click(screen.getByTestId('channel-strip-CG 1'));
        expect(screen.getByTestId('channel-strip-CG 1')).toHaveAttribute('data-selected', 'true');
        expect(screen.getByTestId('channel-strip-Master')).toHaveAttribute('data-selected', 'false'); // Deselected
        expect(screen.getByText('Inspector for group-1')).toBeInTheDocument();
    });
});
