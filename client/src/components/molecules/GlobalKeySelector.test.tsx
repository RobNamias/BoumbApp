import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GlobalKeySelector from './GlobalKeySelector';

describe('GlobalKeySelector', () => {
    it('renders the current key label', () => {
        render(<GlobalKeySelector root="C" scale="Major" onChange={() => { }} />);
        expect(screen.getByText('KEY')).toBeInTheDocument();
        // Use a more flexible matcher for "C Major" to be safe against styling wrapper
        expect(screen.getByText(/C.*Major/)).toBeInTheDocument();
    });

    it('opens the popover when clicked', () => {
        render(<GlobalKeySelector root="C" scale="Major" onChange={() => { }} />);
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);
        // Expect to see list of roots and scales
        expect(screen.getByText('C#')).toBeInTheDocument();
        expect(screen.getByText('Minor')).toBeInTheDocument();
    });

    it('calls onChange when a new key is selected', () => {
        const handleChange = vi.fn();
        render(<GlobalKeySelector root="C" scale="Major" onChange={handleChange} />);

        // Open
        fireEvent.click(screen.getByRole('button'));

        // Select 'D'
        fireEvent.click(screen.getByText('D'));

        // Select 'Minor'
        fireEvent.click(screen.getByText('Minor'));

        // Check if onChange was called with D Minor
        // Note: Implementation might call onChange on every click or have a confirm.
        // Assuming immediate update for "Sobriety"
        expect(handleChange).toHaveBeenCalledWith('D', 'Minor');
    });
});
