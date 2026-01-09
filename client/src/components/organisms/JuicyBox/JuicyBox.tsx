import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useProjectStore } from '../../../store/projectStore';
import { useAppStore } from '../../../store/useAppStore';
import { useProjectAudio } from '../../../hooks/useProjectAudio';
import { Citrus } from 'lucide-react';
import styles from '../../../styles/modules/JuicyBox.module.scss';
import ModuleHeader from '../../molecules/ModuleHeader';
import JuicyBoxGrid from './JuicyBoxGrid';
import PatternSelector from './PatternSelector';
import type { Track } from '../../molecules/TrackHeader';

const JuicyBox: React.FC = () => {
    // 0. Audio Sync (with UI Feedback)
    const [playingStep, setPlayingStep] = React.useState(-1);

    // DnD Drop Zone (Target for Kit Load)
    const { setNodeRef, isOver } = useDroppable({
        id: 'juicybox-main',
        data: { type: 'kit-target' }
    });

    // Use Tone.Draw to schedule UI updates for smoother performance?
    // AudioEngine loop callback runs in audio thread lookahead.
    // Direct state update is fine for simple MVP grids.
    useProjectAudio(setPlayingStep);

    // 1. Store Connection
    const {
        project,
        activePatterns,
        createPattern,
        setActivePattern,
        // updateTrackMixer, // DEPRECATED
        updateTrackVolume,
        toggleTrackMute,
        toggleTrackSolo,
        updateTrackRouting,
        addNote,
        removeNote,
        updateNote,
        // addTrack
    } = useProjectStore();

    // 2. Active Pattern Logic
    const activePatternId = activePatterns.drums;
    const patterns = project.drumPatterns;
    const activePattern = activePatternId ? patterns[activePatternId] : null;

    // 3. Data Mapping (Global Tracks + Pattern Clips -> UI Track)
    const uiTracks: Track[] = useMemo(() => {
        const drumTracks = Object.values(project.tracks)
            .filter(t => t.type === 'drums');

        return drumTracks.map((track) => {
            const clips = activePattern?.clips[track.id] || [];

            const denseSteps = new Array(32).fill(0).map((_, i) => {
                const note = clips.find(n => {
                    const [bar, beat, six] = n.time.split(':').map(Number);
                    const idx = (bar * 16) + (beat * 4) + six;
                    return idx === i;
                });

                if (note) {
                    return { active: true, value: 1, volume: note.velocity, fill: note.fill ?? 1 };
                }
                return { active: false, value: 0 };
            });

            return {
                id: track.id,
                name: track.name,
                sample: track.instrument.sampleId || '',
                pan: track.pan,
                muted: track.muted,
                solo: track.solo,
                volume: track.volume,
                output: track.mixerChannelId,
                steps: denseSteps,
                isMuted: track.muted,
                isSolo: track.solo
            };
        });
    }, [project.tracks, activePattern]);

    // 4. Handlers

    // --- Mixer Handlers (Global) ---
    const handleVolumeChange = (trackId: string, volume: number) => {
        updateTrackVolume(trackId, volume);
    };

    const handleMuteChange = (trackId: string, muted: boolean) => {
        const track = project.tracks[trackId];
        if (track && track.muted !== muted) toggleTrackMute(trackId);
    };

    const handleSoloChange = (trackId: string, solo: boolean) => {
        const track = project.tracks[trackId];
        if (track && track.solo !== solo) toggleTrackSolo(trackId);
    };

    const handleOutputChange = (trackId: string, output: number) => {
        // Output comes as 1, 2, 3... Map to insert-1, insert-2
        updateTrackRouting(trackId, `insert-${output}`);
    };

    // --- Interaction Handler (Pattern Clips) ---
    const handleStepInteraction = (updatedTrack: Track) => {
        if (!activePatternId || !activePattern) return;

        const stepToTime = (index: number) => {
            const bar = Math.floor(index / 16);
            const beat = Math.floor((index % 16) / 4);
            const six = index % 4;
            return `${bar}:${beat}:${six}`;
        };

        updatedTrack.steps.forEach((step, index) => {
            const time = stepToTime(index);
            const stepObj = (typeof step === 'number' ? { active: step > 0, value: step, volume: 0.8, fill: 1 } : step) as any;
            const isActive = stepObj.active;
            const volume = stepObj.volume || 0.8;
            const fill = stepObj.fill ?? 1;

            // Find existing note in the REAL STORE data (activePattern.clips)
            const trackClips = activePattern.clips[updatedTrack.id] || [];
            const existingNote = trackClips.find(n => n.time === time);

            if (isActive) {
                if (!existingNote) {
                    // CREATE
                    addNote(activePatternId, updatedTrack.id, {
                        time,
                        note: 'C4', // Standard drum trigger
                        duration: '16n',
                        velocity: volume,
                        fill
                    });
                } else if (
                    Math.abs(existingNote.velocity - volume) > 0.01 ||
                    Math.abs((existingNote.fill ?? 1) - fill) > 0.01
                ) {
                    // UPDATE
                    // Store V2 has updateNote(pid, tid, oldNote, newNote)
                    // We need to pass the OLD note object reference or partial?
                    // The Store search by time/note-val.
                    updateNote(activePatternId, updatedTrack.id, existingNote, {
                        ...existingNote,
                        velocity: volume,
                        fill
                    });
                }
            } else if (existingNote) {
                // DELETE
                removeNote(activePatternId, updatedTrack.id, existingNote);
            }
        });
    };

    // 5. View Mode
    const { viewMode, setViewMode } = useAppStore();

    return (
        <div
            ref={setNodeRef}
            className="juicy-box-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                // gap: '10px', // Handled by margins generally, gap might push header down if there was a hidden element? 
                // Wait, flex gap adds space BETWEEN items. Header is item 1. Grid is item 2.
                // Gap is effectively margin-bottom of header. That is consistent with Timeline?
                gap: '10px',

                // Border was causing 2px shift/reduction in size. 
                // We only want border OVERLAY or inset for drag, or just outlining.
                // Removing default border to align flush with container.
                border: isOver ? '2px dashed #E91E63' : 'none',
                boxSizing: 'border-box', // Ensure border doesn't expand size
                transition: 'all 0.2s'
            }}
        >

            {/* Contextual Toolkit / Toolbar */}
            <ModuleHeader
                title="JuicyBox"
                icon={Citrus}
                color="#ff9800"
            >
                {/* Center: Pattern Management */}
                <div style={{ margin: '0 auto' }}>
                    <PatternSelector
                        patterns={Object.values(patterns)}
                        activePatternId={activePatternId}
                        onSelectPattern={(id) => setActivePattern('drums', id)}
                        onCreatePattern={() => {
                            const nextIndex = Object.keys(patterns).length;
                            const letter = String.fromCharCode(65 + nextIndex); // 0 -> A, 1 -> B
                            createPattern('drums', letter);
                        }}
                        color="orange"
                    />
                </div>

                {/* Right: Interaction Mode */}
                <div className={styles.viewSelector}>
                    {(['trigger', 'volume', 'fill'] as const).map(mode => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setViewMode(mode)}
                            className={viewMode === mode ? styles.active : ''}
                        >
                            {mode === 'volume' ? 'Vel' : mode}
                        </button>
                    ))}
                </div>
            </ModuleHeader>

            {/* The Grid */}
            <JuicyBoxGrid
                tracks={uiTracks}
                onUpdateTrack={handleStepInteraction}
                playingStep={playingStep >= 0 ? playingStep % (activePattern?.duration || 32) : -1}
                onTrackVolumeChange={handleVolumeChange} // Connected!
                onTrackMuteChange={handleMuteChange}     // Connected!
                onTrackSoloChange={handleSoloChange}     // Connected!
                onTrackOutputChange={handleOutputChange} // Connected!
            />
        </div>
    );
};

export default JuicyBox;
