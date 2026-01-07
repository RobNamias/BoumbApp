import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimelineCursor from './TimelineCursor';


// Mock AudioEngine
vi.mock('../../../audio/AudioEngine', () => ({
    default: {
        getCurrentTime: vi.fn(),
        seekToTime: vi.fn(),
    }
}));

describe('TimelineCursor', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(<TimelineCursor zoom={1} />);
        const cursor = screen.getByTestId('timeline-cursor');
        expect(cursor).toBeInTheDocument();
        // Should start at 0
        expect(cursor).toHaveStyle({ left: '0px' });
    });

    /* 
       Note: Testing requestAnimationFrame (rAF) in jsdom is tricky.
       We typically trust the implementation of the loop or use specific test helpers.
       For this unit test, we check if the component renders. 
    */
});
