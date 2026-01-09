import React, { useState } from 'react';
import styles from '../../../styles/modules/MainLayout.module.scss';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import TopBar from '../../organisms/TopBar';
import SynthLabPage from '../../../pages/SynthLabPage';
import Timeline from '../../organisms/Timeline';
import { useProjectStore } from '../../../store/projectStore';
import BrowserPanel from '../../organisms/Browser/BrowserPanel';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import GlobalLoader from '../../atoms/GlobalLoader';
import MixerBoard from '../../organisms/Mixer/MixerBoard';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    // View State (Local for now, could be in SessionStore)
    const [currentView, setCurrentView] = useState<'skyline' | 'studio' | 'synthlab' | 'mixer' | 'settings'>('studio');
    const [isBrowserOpen, setIsBrowserOpen] = useState(true);

    // DnD Sensors (Constraint distance to prevent accidental drags on clicks)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Store Integration for Timeline & Logic
    const { project } = useProjectStore();

    // Generic Lanes (Audio Tracks)
    const timelineTracks = Array.from({ length: 8 }, (_, i) => ({
        id: `lane-${i + 1}`,
        name: `Track ${i + 1}`
    }));

    // Unified Timeline Clips
    const timelineClips = project.timeline.clips;

    const { updateTimelineClip, addTimelineClip, createPattern } = useProjectStore();

    const handleClipMove = (clipId: string, newPosition: { start?: number; trackId?: string }) => {
        // Unified update
        if (newPosition.start !== undefined || newPosition.trackId !== undefined) {
            updateTimelineClip(clipId, newPosition);
        }
    };

    // We need createPattern to make a valid clip.
    const handleClipAddAction = (trackId: string, start: number) => {
        // Default to Drums for now (JuicyBox usage)
        const type: 'drums' | 'melody' = 'drums';
        const patternId = createPattern(type, `Pattern ${Math.floor(start / 16) + 1}`); // Auto-name

        const newClip = {
            id: `clip-${Date.now()}`,
            patternId: patternId,
            trackId: trackId,
            start: start,
            duration: 32 // Default duration
        };

        addTimelineClip(newClip);
    };

    const { updateTrackInstrument } = useProjectStore();

    // --- DnD Handler ---
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeData = active.data.current; // { type: 'kit'|'sample', ... }
        const overData = over.data.current;     // { type: 'track-target'|'kit-target', ... }

        if (!activeData || !overData) return;

        console.log("DnD Drop:", { source: activeData, target: overData });

        // 1. Drop KIT on JuicyBox (Global Load)
        if (activeData.type === 'kit' && overData.type === 'kit-target') {
            const samples = activeData.samples as Record<string, string>;
            // Map common types to specific usage if needed, or iterate
            // Strategy: 
            // - Look for tracks named "Kick", "Snare", etc. OR
            // - Just fill tracks 1-4 with Kick, Snare, CH, OH.

            // Hardcoded mapping for MVP (Standard 808/909 layout)
            /* const map: Record<string, string> = {
                'Kick': 'Kick',
                'Snare': 'Snare',
                'ClosedHat': 'ClosedHat', // or ClHat
                'OpenHat': 'OpenHat',     // or OpHat
                'Crash': 'Crash',
                'Tom': 'Tom'
            }; */

            // Needs access to existing tracks to find IDs by Name or Index??
            // We can't easily access state inside this callback if we don't grab it via hook.
            // But we have useProjectStore() above.
            const projectTracks = useProjectStore.getState().project.tracks;
            const drumTracks = Object.values(projectTracks).filter(t => t.type === 'drums');

            drumTracks.forEach(track => {
                // Fuzzy match track name to sample type?
                // Or just use index? 
                // Let's try name matching first.
                const samplePath = samples[track.name] || samples[Object.keys(samples).find(k => track.name.includes(k)) || ''];

                if (samplePath) {
                    updateTrackInstrument(track.id, { sampleId: samplePath });
                }
            });
        }

        // 2. Drop SAMPLE on TrackHeader (Single Load)
        if (activeData.type === 'sample' && overData.type === 'track-target') {
            const trackId = overData.trackId;
            const samplePath = activeData.path;

            if (trackId && samplePath) {
                updateTrackInstrument(trackId, { sampleId: samplePath });
            }
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <GlobalLoader />
            <div className={styles.layoutContainer}>
                <Sidebar
                    currentView={currentView}
                    onViewChange={setCurrentView}
                    toggleBrowser={() => setIsBrowserOpen(!isBrowserOpen)}
                    isBrowserOpen={isBrowserOpen}
                />

                {isBrowserOpen && <BrowserPanel />}

                <div className={styles.mainContent}>
                    <TopBar />

                    <main className={styles.workspace}>
                        {/* The "Skyline" vs "Earth" zones logic will live here */}
                        {/* For now, just render children or specific views based on `currentView` */}

                        {currentView === 'skyline' && (
                            <div className={styles.skylineView} style={{ height: '100%' }}>
                                <Timeline
                                    tracks={timelineTracks}
                                    clips={timelineClips}
                                    onClipMove={handleClipMove}
                                    onClipAdd={handleClipAddAction}
                                />
                            </div>
                        )}

                        {currentView === 'studio' && (
                            <div className={styles.studioView}>
                                {children} {/* Default slot for JuicyBox/SynthLab pages */}
                            </div>
                        )}

                        {currentView === 'synthlab' && (
                            <div className={styles.synthView} style={{ height: '100%' }}>
                                <SynthLabPage />
                            </div>
                        )}

                        {currentView === 'mixer' && (
                            <div className={styles.mixerView} style={{ height: '100%' }}>
                                <MixerBoard />
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {/* Drag Overlay would go here for visual feedback */}
        </DndContext>
    );
};

export default MainLayout;
