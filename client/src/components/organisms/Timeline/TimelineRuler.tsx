import React from 'react';
import * as Tone from 'tone';
import audioInstance from '../../../audio/AudioEngine';
import styles from '../../../styles/modules/Timeline.module.scss';

interface TimelineRulerProps {
    zoom: number;
    length?: number; // Total length in steps, default 128 or dynamic?
}

const TimelineRuler: React.FC<TimelineRulerProps> = ({ zoom, length = 128 }) => {
    // 1 Bar = 16 Steps (4/4 time)
    // We want to render markers every Bar (or every Beat depending on zoom)

    const PIXELS_PER_STEP = 20 * zoom;
    const STEPS_PER_BAR = 16;
    const BAR_WIDTH = STEPS_PER_BAR * PIXELS_PER_STEP;

    const numBars = Math.ceil(length / STEPS_PER_BAR);

    const bars = Array.from({ length: numBars }, (_, i) => i + 1);

    const handleRulerClick = (e: React.MouseEvent) => {
        // Calculate click position relative to ruler start
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const relativeX = e.clientX - rect.left;

        // Convert Pixels -> Seconds
        // Pixels = Seconds * (BPM/15) * (20*zoom)
        // Seconds = Pixels / ((BPM/15) * (20*zoom))

        const bpm = Tone.getTransport().bpm.value;
        const stepsPerSecond = bpm / 15;
        const pixelsPerSecond = stepsPerSecond * PIXELS_PER_STEP;

        const newTime = relativeX / pixelsPerSecond;
        audioInstance.seekToTime(newTime);
    };

    return (
        <div
            className={styles.rulerContainer}
            onClick={handleRulerClick}
            style={{ cursor: 'pointer' }}
        >
            {bars.map(bar => (
                <div
                    key={bar}
                    className={styles.rulerLabel}
                    style={{ left: `${(bar - 1) * BAR_WIDTH}px` }}
                >
                    {bar}
                </div>
            ))}
            {/* Ticks logic could go here */}
        </div>
    );
};

export default TimelineRuler;
