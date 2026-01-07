import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TimeDisplay from './TimeDisplay';

describe('TimeDisplay Atom', () => {
    it('renders initial step 0 as 001 : 01 : 01', () => {
        render(<TimeDisplay step={0} />);
        expect(screen.getByText('001')).toBeInTheDocument();
        expect(screen.getByText('01', { selector: 'span:nth-of-type(3)' })).toBeInTheDocument(); // Beat
        // Note: Step is also '01' but let's just check existence of values for now or use specific structure if needed.
        // Given duplicate '01', getByText might return multiple.
        // Let's refine:
        const container = render(<TimeDisplay step={0} />).container;
        expect(container).toHaveTextContent('001:01:01');
    });

    it('renders step 4 (Beat 2) as 001 : 02 : 01', () => {
        const { container } = render(<TimeDisplay step={4} />);
        expect(container).toHaveTextContent('001:02:01');
    });

    it('renders step 16 (Bar 2) as 002 : 01 : 01', () => {
        const { container } = render(<TimeDisplay step={16} />);
        expect(container).toHaveTextContent('002:01:01');
    });
});
