import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Switch from './Switch';

describe('Switch Atom', () => {
    it('renders with correct accessibility role', () => {
        render(<Switch checked={false} onChange={() => { }} label="Toggle Me" />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toBeInTheDocument();
        expect(switchEl).toHaveAttribute('aria-label', 'Toggle Me');
    });

    it('reflects checked state', () => {
        const { rerender } = render(<Switch checked={false} onChange={() => { }} />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

        rerender(<Switch checked={true} onChange={() => { }} />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('calls onChange when clicked', () => {
        const handleChange = vi.fn();
        render(<Switch checked={false} onChange={handleChange} />);

        fireEvent.click(screen.getByRole('switch'));
        expect(handleChange).toHaveBeenCalledWith(true);
    });
});
