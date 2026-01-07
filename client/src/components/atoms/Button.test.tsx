import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';
import '@testing-library/jest-dom'; // Ensure jest-dom matchers are available

describe('Button Atom', () => {
    it('renders with correct label (children)', () => {
        render(<Button onClick={() => { }}>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with correct label (prop)', () => {
        render(<Button label="Click Me Prop" onClick={() => { }} />);
        expect(screen.getByText('Click Me Prop')).toBeInTheDocument();
    });

    it('triggers onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant class correctly', () => {
        render(<Button variant="danger" onClick={() => { }}>Danger</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn--danger');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled onClick={() => { }}>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
