import React, { useState, useEffect } from 'react';
import TimelineClip from './TimelineClip';
import TimelineCursor from './TimelineCursor';
import TimelineRuler from './TimelineRuler';
import styles from '../../../styles/modules/Timeline.module.scss';
import type { TimelineClip as TimelineClipType } from '../../../store/projectStore';
// import { useProjectStore } from '../../../store/projectStore';

interface TimelineGridProps {
    tracks?: any[];
    groups?: any[];
    clips?: TimelineClipType[];
    zoom: number;
    playingStep?: number;
    onClipMove?: (clipId: string, newPosition: { start?: number; trackId?: string }) => void;
    onClipAdd?: (trackId: string, start: number, patternId?: string) => void;
    onClipRemove?: (clipId: string) => void;
}

const TimelineGrid: React.FC<TimelineGridProps> = ({
    tracks = [],
    clips = [],
    zoom,
    playingStep = -1,
    onClipMove,
    onClipAdd,
    onClipRemove
}) => {
    // Left empty for now, store not needed directly if we rely on props
    // const { project } = useProjectStore();

    // Drag State
    const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
    const [dragStartX, setDragStartX] = useState<number>(0);
    const [initialClipStart, setInitialClipStart] = useState<number>(0);

    const handleClipMouseDown = (e: React.MouseEvent, clip: TimelineClipType) => {
        if (e.button !== 0) return; // Only Left Click
        e.stopPropagation();
        setDraggingClipId(clip.id);
        setDragStartX(e.clientX);
        setInitialClipStart(clip.start);
    };

    const handleTrackDoubleClick = (e: React.MouseEvent, trackId: string) => {
        if (!onClipAdd) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const PIXELS_PER_STEP = 20 * zoom;
        const startStep = Math.floor(relativeX / PIXELS_PER_STEP);
        onClipAdd(trackId, startStep);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent, trackId: string) => {
        e.preventDefault();
        const patternId = e.dataTransfer.getData('patternId');

        if (patternId && onClipAdd) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            // Note: handleDrop on trackLane, relativeX is correct within that lane.
            const relativeX = e.clientX - rect.left;
            const PIXELS_PER_STEP = 20 * zoom;
            const startStep = Math.floor(relativeX / PIXELS_PER_STEP);
            onClipAdd(trackId, startStep, patternId);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingClipId || !onClipMove) return;

        const PIXELS_PER_STEP = 20 * zoom;
        const deltaX = e.clientX - dragStartX;
        const deltaSteps = Math.round(deltaX / PIXELS_PER_STEP);
        const newStart = Math.max(0, initialClipStart + deltaSteps);

        onClipMove(draggingClipId, { start: newStart });
    };

    const handleMouseUp = () => {
        if (draggingClipId) setDraggingClipId(null);
    };

    useEffect(() => {
        if (draggingClipId) {
            globalThis.addEventListener('mousemove', handleMouseMove);
            globalThis.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            globalThis.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingClipId, dragStartX, initialClipStart, onClipMove, zoom]);

    // Layout Calculation
    const maxStep = clips.reduce((max, c) => Math.max(max, c.start + c.duration), 64);
    const PIXELS_PER_STEP = 20 * zoom;
    const requiredWidth = (maxStep + 32) * PIXELS_PER_STEP;

    const containerStyle: React.CSSProperties = {
        minWidth: '100%',
        width: `${requiredWidth}px`,
        position: 'relative'
    };

    // --- Render Logic ---

    // Simple Flat Tracks (Generic Lanes)
    // No drawers, no expansion. Just lanes.
    const content = tracks.map(track => renderTrackLane(track));

    // Helper to render a single lane
    function renderTrackLane(track: any) {
        const trackClips = clips.filter(c => c.trackId === track.id);
        const beatWidth = 4 * PIXELS_PER_STEP;
        return (
            <div
                key={track.id}
                className={styles.trackLane}
                style={{
                    backgroundSize: `${beatWidth}px 100%`,
                    backgroundImage: `linear-gradient(90deg, #333 1px, transparent 1px)`
                }}
                onDoubleClick={(e) => handleTrackDoubleClick(e, track.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, track.id)}
                data-testid="track-lane"
            >
                {trackClips.map((clip) => (
                    <TimelineClip
                        key={clip.id}
                        clip={clip}
                        zoom={zoom}
                        onMouseDown={(e: React.MouseEvent) => handleClipMouseDown(e, clip)}
                        onDoubleClick={() => onClipRemove?.(clip.id)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.gridArea} style={containerStyle}>
            <div className={styles.ruler}>
                <TimelineRuler zoom={zoom} />
            </div>

            <TimelineCursor zoom={zoom} playingStep={playingStep} />

            <div className={styles.trackLanes}>
                {content}
            </div>
        </div>
    );
};

export default TimelineGrid;
