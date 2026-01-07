import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination Molecule', () => {
    it('renders correct number of pages', () => {
        render(<Pagination totalPages={4} currentPage={0} playingPage={0} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(4);
    });

    it('indicates current viewed page (focus)', () => {
        render(<Pagination totalPages={4} currentPage={2} playingPage={0} />);
        const buttons = screen.getAllByRole('button');
        // We expect a specific visual indicator, e.g., a class or aria-current
        expect(buttons[2]).toHaveAttribute('aria-current', 'page');
    });

    it('indicates playing page', () => {
        // Implementation detail: checking for a specific class or child element (LED)
        render(<Pagination totalPages={4} currentPage={0} playingPage={1} />);
        const buttons = screen.getAllByRole('button');
        // The playing page button should contain an active indicator (LED or class)
        expect(buttons[1].innerHTML).toContain('led');
    });

    it('calls onPageSelect when a page is clicked', () => {
        const handleSelect = vi.fn();
        render(<Pagination totalPages={4} currentPage={0} playingPage={0} onPageSelect={handleSelect} />);

        fireEvent.click(screen.getByText('3')); // Assuming pages are numbered 1-4 displayed as 1, 2, 3, 4
        expect(handleSelect).toHaveBeenCalledWith(2); // 0-indexed
    });
});
