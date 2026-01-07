import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Timeline from './Timeline';

// Mock TimelineClip to ensure it renders with a known structure for testing
vi.mock('./TimelineClip', () => ({
    default: ({ clip, onClick, onMouseDown }: any) => (
        <div
            data-testid="timeline-clip"
            data-clip-id={clip.id}
            onClick={(e) => onClick && onClick(e, clip)}
            onMouseDown={(e) => onMouseDown && onMouseDown(e, clip)}
            style={{ position: 'absolute', left: clip.start * 20, width: clip.duration * 20 }}
        >
            {clip.patternId}
        </div>
    )
}));

describe('Timeline Interaction', () => {
    const mockTracks = [{ id: 'track-1', name: 'Melody' }];
    const mockClips = [
        { id: 'clip-1', patternId: 'p1', trackId: 'track-1', start: 0, duration: 32 }
    ];

    // Helper function to set up the component for tests
    const setup = (props = {}) => {
        const defaultProps = {
            tracks: mockTracks,
            clips: mockClips,
            onClipMove: vi.fn(),
            onClipAdd: vi.fn(),
            ...props,
        };
        const { getByTestId, getAllByTestId } = render(<Timeline {...defaultProps} />);
        return { getByTestId, getAllByTestId, props: defaultProps };
    };

    it('triggers onClipMove when a clip is dragged', () => {
        const { getByTestId, props } = setup({
            clips: [{ id: 'c1', patternId: 'p1', trackId: 'track-1', start: 0, duration: 32 }]
        });

        // Mock getBoundingClientRect for the clip element if needed for more complex drag logic
        const clipElement = getByTestId('timeline-clip');

        // Start Drag
        fireEvent.mouseDown(clipElement, { clientX: 100 });

        // Move Mouse (global)
        fireEvent.mouseMove(window, { clientX: 140 }); // +40px = +2 steps (at 20px/step)

        // Simulate Drag End
        fireEvent.mouseUp(window);

        expect(props.onClipMove).toHaveBeenCalledWith('c1', expect.objectContaining({ start: 2 }));
    });

    it('triggers onClipAdd when a track lane is double clicked', () => {
        const { getAllByTestId, props } = setup({
            tracks: [{ id: 't1', name: 'Track 1' }]
        });

        const trackLanes = getAllByTestId('track-lane');
        const firstLane = trackLanes[0]; // Method 't1'

        // Mock getBoundingClientRect for the lane
        // We need to ensure the calculation works: relativeX = clientX - rect.left
        vi.spyOn(firstLane, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 500,
            height: 40,
            bottom: 40,
            right: 500,
            x: 0,
            y: 0,
            toJSON: () => { }
        });

        // Double Click at X=100. 
        // 20px per step => 5 steps
        fireEvent.doubleClick(firstLane, { clientX: 100, bubbles: true });

        expect(props.onClipAdd).toHaveBeenCalledWith('t1', 5);
    });
});
