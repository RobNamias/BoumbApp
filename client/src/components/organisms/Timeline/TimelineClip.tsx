import React from 'react';
import styles from '../../../styles/modules/Timeline.module.scss';
import type { TimelineClip as TimelineClipType } from '../../../store/projectStore';
import { useProjectStore } from '../../../store/projectStore';

interface TimelineClipProps {
    clip: TimelineClipType;
    zoom: number;
    // onClick?: (e: React.MouseEvent, clip: TimelineClipType) => void; // Unused for now
    onMouseDown?: (e: React.MouseEvent, clip: TimelineClipType) => void;
    onDoubleClick?: (e: React.MouseEvent, clip: TimelineClipType) => void;
}

const TimelineClip: React.FC<TimelineClipProps> = ({ clip, zoom, onMouseDown, onDoubleClick }) => {
    // Access store to get pattern name
    const project = useProjectStore(state => state.project);

    const patternName = project.drumPatterns[clip.patternId]?.name ||
        project.melodicPatterns[clip.patternId]?.name ||
        'Unknown';

    // Assuming clip.start is in Steps (16th notes)
    // Assuming zoom is Pixels per Step (default e.g. 10 or 20)
    const PIXELS_PER_STEP = 20 * zoom;

    const left = clip.start * PIXELS_PER_STEP;
    const width = clip.duration * PIXELS_PER_STEP;

    // Determine Type for Color based on Pattern Type
    const isDrum = !!project.drumPatterns[clip.patternId];
    const typeClass = isDrum ? styles.drums : styles.melody;

    return (
        <div
            className={`${styles.timelineClip} ${typeClass}`}
            style={{
                left: `${left}px`,
                width: `${width}px`
            }}
            title={`${patternName} (Track: ${clip.trackId})`}
            role="button"
            tabIndex={0}
            onKeyDown={() => { }}
            onMouseDown={(e) => onMouseDown?.(e, clip)}
            onDoubleClick={(e) => {
                e.stopPropagation(); // Stop propagation to grid
                onDoubleClick?.(e, clip);
            }}
        >
            <span className={styles.clipLabel}>{patternName || clip.patternId}</span>
        </div>
    );
};

export default TimelineClip;
