import React from 'react';
import styles from '../../../styles/modules/Timeline.module.scss';

interface TimelineCursorProps {
    zoom: number;
    playingStep?: number;
}

const TimelineCursor: React.FC<TimelineCursorProps> = ({ zoom, playingStep = -1 }) => {
    // PIXELS_PER_STEP is 20 * zoom (Defined in TimelineClip/Grid)
    const PIXELS_PER_STEP = 20 * zoom;

    // Use playingStep directly. If -1, hide or put at 0.
    const displayStep = Math.max(0, playingStep);
    const leftPosition = displayStep * PIXELS_PER_STEP;

    // Smooth transition via CSS (will-change: left is already in SCSS)

    return (
        <div
            data-testid="timeline-cursor"
            className={styles.timelineCursor}
            style={{
                left: `${leftPosition}px`,
                display: playingStep >= 0 ? 'block' : 'none'
            }}
        />
    );
};

export default TimelineCursor;
