import React from 'react';
import Timeline from '../components/organisms/Timeline';
import { useProjectStore } from '../store/projectStore';
import { useAppStore } from '../store/useAppStore';
import { useProjectAudio } from '../hooks/useProjectAudio';
import TimelineDebugOverlay from '../components/organisms/Timeline/TimelineDebugOverlay';

const SongModePage: React.FC = () => {
    const { project, updateTimelineClip, addTimelineClip, removeTimelineClip, createPattern, activePatterns } = useProjectStore();
    const { setPlayingStep, playingStep } = useAppStore();

    // Sync Audio Engine & Sequencer Loop
    useProjectAudio(setPlayingStep);


    // Library Groups (Sources)
    const timelineGroups = [
        { id: 'group-juicy', name: 'JuicyBox', type: 'drums' },
        { id: 'group-synth', name: 'SynthLab', type: 'melody' }
    ];

    // Generic Grid Tracks (Destinations)
    const timelineTracks = Array.from({ length: 12 }, (_, i) => ({
        id: `lane-${i + 1}`,
        name: `Track ${i + 1}`
    }));

    // Unified Timeline Clips
    const timelineClips = project.timeline.clips;

    const handleClipMove = (clipId: string, newPosition: { start?: number; trackId?: string }) => {
        // Unified update
        if (newPosition.start !== undefined || newPosition.trackId !== undefined) {
            updateTimelineClip(clipId, newPosition);
        }
    };

    const handleClipAdd = (trackId: string, start: number, patternId?: string) => {
        // Default to Drums for double-click creation (JuicyBox usage)
        // If DnD (patternId present), use that pattern's type implicitly
        let finalPatternId = patternId;

        if (!finalPatternId) {
            // Check active drum pattern first
            finalPatternId = activePatterns.drums || undefined;

            // Fallback: Create new
            if (!finalPatternId) {
                finalPatternId = createPattern('drums', `Pattern ${Math.floor(start / 16) + 1}`);
            }
        }

        if (!finalPatternId) return;

        const newClip = {
            id: `clip-${Date.now()}`,
            patternId: finalPatternId,
            trackId: trackId, // Any generic lane
            start: start,
            duration: 32 // Default
        };

        addTimelineClip(newClip);
    };

    const handleClipRemove = (clipId: string) => {
        removeTimelineClip(clipId);
    };

    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <Timeline
                tracks={timelineTracks}
                groups={timelineGroups} // New Prop
                clips={timelineClips}
                onClipMove={handleClipMove}
                onClipAdd={handleClipAdd}
                onClipRemove={handleClipRemove}
                playingStep={playingStep}
            />
            <TimelineDebugOverlay />
        </div>
    );
};

export default SongModePage;
