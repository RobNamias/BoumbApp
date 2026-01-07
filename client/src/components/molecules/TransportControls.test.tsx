import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TransportControls from './TransportControls';

describe('TransportControls Molecule', () => {
    it('renders Play, Pause, Stop and Record buttons', () => {
        render(<TransportControls />);
        expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /record/i })).toBeInTheDocument();
    });

    it('calls appropriate handlers on click', () => {
        const onPlay = vi.fn();
        const onPause = vi.fn();
        const onStop = vi.fn();
        const onRecord = vi.fn();

        render(
            <TransportControls
                onPlay={onPlay}
                onPause={onPause}
                onStop={onStop}
                onRecord={onRecord}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /play/i }));
        expect(onPlay).toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
        expect(onPause).toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /stop/i }));
        expect(onStop).toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /record/i }));
        expect(onRecord).toHaveBeenCalled();
    });

    it('displays active states correctly', () => {
        const { rerender } = render(<TransportControls isPlaying={false} isRecording={false} />);

        // Check default state (e.g. Play not active)
        // Note: Implementation detail, usually checked via class or aria-pressed

        rerender(<TransportControls isPlaying={true} />);
        // Expect visual indication of play (we'll check for a class or attribute later, 
        // for now just ensuring prop works without crashing)
        const playBtn = screen.getByRole('button', { name: /play/i });
        expect(playBtn).toHaveClass('btn--primary'); // Assuming 'primary' variant adds this class

        rerender(<TransportControls isRecording={true} />);
        // Expect visual indication of record
        const recBtn = screen.getByRole('button', { name: /record/i });
        expect(recBtn).toHaveClass('btn--recording'); // Added class in implementation
    });
});
