import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Fader from './Fader';

describe('Fader Atom', () => {
    it('renders with correct accessibility attributes', () => {
        render(<Fader value={50} min={0} max={100} label="Master" />);

        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('aria-label', 'Master');
        expect(slider).toHaveAttribute('aria-orientation', 'vertical');
        expect(slider).toHaveAttribute('aria-valuenow', '50');
        expect(slider).toHaveAttribute('aria-valuemin', '0');
        expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders visual track and thumb', () => {
        const { container } = render(<Fader />);
        expect(container.querySelector('.fader__track')).toBeTruthy();
        expect(container.querySelector('.fader__thumb')).toBeTruthy();
    });

    it('calls onChange when interacted with', () => {
        const handleChange = vi.fn();
        render(<Fader onChange={handleChange} />);
        const slider = screen.getByRole('slider');

        fireEvent.keyDown(slider, { key: 'ArrowUp' });
        expect(handleChange).toHaveBeenCalled();
    });
});
