
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from './Timeline';
import { vi, describe, it, expect } from 'vitest';

// Mocks
vi.mock('./TimelineLibrary', () => ({
    default: ({ groups }: any) => (
        <div data-testid="timeline-library">
            Library with {groups.length} groups
        </div>
    )
}));

vi.mock('./TimelineGrid', () => ({
    default: ({ tracks, zoom }: any) => (
        <div data-testid="timeline-grid">
            Grid with {tracks.length} tracks, Zoom: {zoom}
        </div>
    )
}));

vi.mock('../../../styles/modules/Timeline.module.scss', () => ({
    default: {
        timelineContainer: 'timelineContainer',
        header: 'header',
        workspace: 'workspace',
        gridWrapper: 'gridWrapper',
        gridHelper: 'gridHelper'
    }
}));

describe('Timeline Component', () => {

    it('renders correctly', () => {
        render(<Timeline />);
        expect(screen.getByText(/Skyline/i)).toBeInTheDocument();
        expect(screen.getByTestId('timeline-library')).toBeInTheDocument();
        expect(screen.getByTestId('timeline-grid')).toBeInTheDocument();
    });

    it('passes props to children', () => {
        const mockTracks = [{ id: 't1', name: 'Track 1' }];
        const mockGroups = [{ id: 'g1', name: 'Group 1' }];
        const zoomLevel = 2;

        render(
            <Timeline
                tracks={mockTracks}
                groups={mockGroups}
                zoom={zoomLevel}
            />
        );

        // Check Header Zoom
        expect(screen.getByText(/Skyline/i)).toBeInTheDocument();

        // Check Library Props via text usage in mock
        expect(screen.getByText('Library with 1 groups')).toBeInTheDocument();

        // Check Grid Props via text usage in mock
        expect(screen.getByText(`Grid with 1 tracks, Zoom: ${zoomLevel}`)).toBeInTheDocument();
    });
});
