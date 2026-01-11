import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar/Sidebar';
import TopBar from '../organisms/TopBar';
import BrowserPanel from '../organisms/Browser/BrowserPanel';
import { DndContext, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { useProjectStore } from '../../store/projectStore';
import GlobalLoader from '../atoms/GlobalLoader';

const Layout: React.FC = () => {
    const [isBrowserOpen, setIsBrowserOpen] = useState(false); // Default closed to match user expectation

    const { project, updateTrackInstrument, addTrack } = useProjectStore();

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // DnD Handler
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || !overData) return;

        console.log("DnD Drop:", { source: activeData, target: overData });

        // 1. Drop SAMPLE on TrackHeader (Replacement)
        if (activeData.type === 'sample' && overData.type === 'track-target') {
            const trackId = overData.trackId;
            const samplePath = activeData.path;

            if (trackId && samplePath) {
                updateTrackInstrument(trackId, { sampleId: samplePath });
            }
        }
        // 2. Drop SAMPLE on JuicyBox Empty Area (Creation)
        else if (activeData.type === 'sample' && overData.type === 'kit-target') {
            const samplePath = activeData.path;

            // Limit Check (8 Tracks Max)
            const drumTrackCount = Object.values(project.tracks).filter(t => t.type === 'drums').length;
            if (drumTrackCount >= 8) {
                console.warn("Max drum tracks (8) reached.");
                return;
            }

            // Extract Name (e.g. "Kick" from "samples/kits/808/Kick.ogg")
            // Simple: Takes filename without extension
            const filename = samplePath.split('/').pop() || 'New Track';
            const trackName = filename.split('.')[0];

            const newTrackId = addTrack('drums', trackName, 'sampler');

            // Immediately assign sample (addTrack creates default)
            updateTrackInstrument(newTrackId, { sampleId: samplePath });
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <GlobalLoader />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#1e1e1e', color: '#fff' }}>

                {/* 1. Top Bar (Full Width) */}
                <TopBar />

                {/* 2. Main Workspace (Sidebar + Browser + Content) */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* 2.1 Navigation Sidebar */}
                    <Sidebar
                        toggleBrowser={() => setIsBrowserOpen(!isBrowserOpen)}
                        isBrowserOpen={isBrowserOpen}
                    />

                    {/* 2.2 Browser Panel */}
                    {isBrowserOpen && <BrowserPanel />}

                    {/* 2.3 Route Content (JuicyBox, SynthLab, etc.) */}
                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default Layout;
