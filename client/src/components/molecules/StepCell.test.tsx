import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StepCell from './StepCell';

describe('StepCell Molecule', () => {
    it('renders in trigger mode (default)', () => {
        render(<StepCell mode="trigger" />);
        // Should contain a visual indicator (like a Led or specific class)
        const cell = screen.getByRole('button'); // Assuming it's interactive
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveClass('step-cell');
        expect(cell).toHaveClass('step-cell--trigger');
    });

    it('toggles active state on click', () => {
        const onClick = vi.fn();
        const { rerender } = render(<StepCell isActive={false} onClick={onClick} />);

        const cell = screen.getByRole('button');
        fireEvent.click(cell);
        expect(onClick).toHaveBeenCalled();

        rerender(<StepCell isActive={true} onClick={onClick} />);
        expect(cell).toHaveClass('step-cell--active');
    });

    it('renders volume mode with correct height', () => {
        render(<StepCell mode="volume" value={0.75} isActive={true} />);
        const cell = screen.getByRole('button');
        expect(cell).toHaveClass('step-cell--volume');

        // We expect a visualization of value, e.g., a bar with height/width
        const bar = cell.querySelector('.step-cell__bar');
        expect(bar).toBeInTheDocument();
        expect(bar).toHaveStyle({ height: '75%' });
    });

    it('renders fill mode styling', () => {
        render(<StepCell mode="fill" value={0.5} isActive={true} />);
        const cell = screen.getByRole('button');
        expect(cell).toHaveClass('step-cell--fill');
    });

    it('displays playing state', () => {
        render(<StepCell isPlaying={true} />);
        const cell = screen.getByRole('button');
        expect(cell).toHaveClass('step-cell--playing');
    });
});
