import React from 'react';
import { Layers } from 'lucide-react';
import styles from '../../../styles/modules/Timeline.module.scss';
import TimelineGrid from './TimelineGrid';
import TimelineLibrary from './TimelineLibrary';
import ModuleHeader from '../../molecules/ModuleHeader';

import type { TimelineClip } from '../../../store/projectStore';

export interface TimelineLane {
    id: string;
    name: string;
    [key: string]: any;
}

export interface TimelineProps {
    tracks?: TimelineLane[];
    groups?: TimelineLane[];
    clips?: TimelineClip[];
    zoom?: number;
    playingStep?: number;
    onClipMove?: (clipId: string, newPosition: { start?: number; trackId?: string }) => void;
    onClipAdd?: (trackId: string, start: number, patternId?: string) => void;
    onClipRemove?: (clipId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tracks = [], groups = [], clips = [], zoom = 1, playingStep = -1, onClipMove, onClipAdd, onClipRemove }) => {

    // Pass patterns drag source from Library
    const handleDragStart = (e: React.DragEvent, patternId: string, type: string) => {
        e.dataTransfer.setData('patternId', patternId);
        e.dataTransfer.setData('type', type);
        e.dataTransfer.setData('source', 'library');
    };

    return (
        <div className={styles.timelineContainer}>
            <ModuleHeader
                title="Skyline"
                icon={Layers}
                color="#bb86fc"
            />

            <div className={styles.workspace}>
                {/* Left Panel: Library (Drawers) */}
                <TimelineLibrary
                    groups={groups}
                    onDragStart={handleDragStart}
                />

                {/* Main Scrollable Area: Grid (Piano Roll) */}
                <div className={styles.gridWrapper}>
                    {/* Helper aligned to top-right */}
                    <div className={styles.gridHelper}>
                        Double-click to create, drag to move.
                    </div>

                    <TimelineGrid
                        tracks={tracks} // Just Generic Lanes
                        clips={clips}
                        zoom={zoom}
                        playingStep={playingStep}
                        onClipMove={onClipMove}
                        onClipAdd={onClipAdd}
                        onClipRemove={onClipRemove}
                    />
                </div>
            </div>
        </div>
    );
};

export default Timeline;
