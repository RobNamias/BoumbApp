import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Knob from './Knob';

describe('Knob Atom', () => {
    it('renders without crashing', () => {
        render(<Knob label="Volume" />);
        expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('has the correct accessibility role', () => {
        render(<Knob />);
        const slider = screen.getByRole('slider', { hidden: true });
        expect(slider).toBeInTheDocument();
    });

    it('renders an SVG element', () => {
        const { container } = render(<Knob />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('calls onChange when interacted with', () => {
        const handleChange = vi.fn();
        render(<Knob onChange={handleChange} />);
        const knob = screen.getByRole('slider', { hidden: true });

        // Simulate keyboard interaction
        fireEvent.keyDown(knob, { key: 'ArrowUp' });
        expect(handleChange).toHaveBeenCalled();
    });
});
