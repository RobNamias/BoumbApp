import React, { useEffect, useState, useRef } from 'react';
import styles from '../../../styles/modules/SynthLab.module.scss';
import { useProjectStore } from '../../../store/projectStore';
import { useAppStore } from '../../../store/useAppStore';
import { useProjectAudio } from '../../../hooks/useProjectAudio';

import PatternSelector from '../JuicyBox/PatternSelector'; // Reuse!
import PianoRoll from '../PianoRoll/PianoRoll';
import SynthPanel from '../SynthPanel/SynthPanel';
import { Plus, Sparkles, ChevronRight, FlaskConical } from 'lucide-react';
import AIComposerPopover from '../AIComposer/AIComposerPopover';
import Knob from '../../atoms/Knob';
import Led from '../../atoms/Led';
import DragInput from '../../atoms/DragInput';
import ModuleHeader from '../../molecules/ModuleHeader';

const SynthLab: React.FC = () => {
    // --- Store Access ---
    const {
        project,
        activePatterns,
        createPattern,
        setActivePattern,
        addTrack,
        updateTrackVolume,
        toggleTrackMute,
        updateTrackRouting
    } = useProjectStore();

    // --- App Store (Playback) ---
    const { isPlaying, playingStep } = useAppStore();

    // --- Audio Sync ---
    useProjectAudio(); // Essential for Audio Engine to run!

    // --- Local State ---
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const aiTriggerRef = useRef<HTMLButtonElement>(null);
    const { setClip } = useProjectStore();

    // --- Initialization & Pattern Management ---
    const currentPatternId = activePatterns.melody;
    const currentPattern = currentPatternId ? project.melodicPatterns[currentPatternId] : null;

    // Ensure we have at least one pattern active
    useEffect(() => {
        if (!currentPatternId) {
            // Check if any exists
            const existingIds = Object.keys(project.melodicPatterns);
            if (existingIds.length > 0) {
                setActivePattern('melody', existingIds[0]);
            } else {
                // Create Default Pattern 1
                const newId = createPattern('melody', 'Pattern 1');
                setActivePattern('melody', newId);
            }
        }
    }, [currentPatternId, project.melodicPatterns, createPattern, setActivePattern]);


    // --- Track Management ---
    const handleAddTrack = () => {
        // patternId is ignored for global tracks now, but we keep signature for safety or future clip init
        const newTrackId = addTrack('melody', 'New Synth', 'synth');
        // AudioEngine is synced via Store updates or useProjectAudio hook now. 
        // We probably don't need manual sync here if addTrack triggers store update which triggers hook sync.
        // But if manual sync is needed:
        // AudioEngine.syncTrack({ id: newTrackId, type: 'synth', mixer: { volume: 0.8, pan: 0, muted: false, solo: false } });
        setSelectedTrackId(newTrackId);
    };

    // Auto-select first track if none selected (Global Tracks)
    // Auto-select first track OR Create Default if none exists
    useEffect(() => {
        const melodicTracks = Object.values(project.tracks).filter(t => t.type === 'melody');
        if (melodicTracks.length === 0) {
            // Create Default Track
            const newTrackId = addTrack('melody', 'Lead Synth', 'synth');
            setSelectedTrackId(newTrackId);
        } else if (!selectedTrackId) {
            setSelectedTrackId(melodicTracks[0].id);
        }
    }, [project.tracks, selectedTrackId, addTrack]);


    if (!currentPatternId || !currentPattern) return <div>Loading SynthLab...</div>;

    const melodicTracks = Object.values(project.tracks).filter(t => t.type === 'melody');

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <ModuleHeader
                title="SynthLab"
                icon={FlaskConical}
                color="#4CAF50"
            >
                {/* Pattern Selector (contextual) */}
                <div style={{ margin: '0 auto' }}>
                    <PatternSelector
                        activePatternId={currentPatternId}
                        onSelectPattern={(id) => setActivePattern('melody', id)}
                        patterns={Object.values(project.melodicPatterns)}
                        onCreatePattern={() => {
                            const nextIndex = Object.keys(project.melodicPatterns).length;
                            const letter = String.fromCharCode(65 + nextIndex);
                            createPattern('melody', letter);
                        }}
                        color="green"
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        ref={aiTriggerRef}
                        className={`${styles.aiButton} ${!selectedTrackId ? styles.disabled : ''}`}
                        onClick={() => selectedTrackId && setIsAIModalOpen(!isAIModalOpen)}
                        title={selectedTrackId ? "Generate Melody w/ AI" : "Select a track first"}
                        disabled={!selectedTrackId}
                    >
                        <Sparkles size={16} />
                        <span>AI Composer</span>
                    </button>

                    {isAIModalOpen && selectedTrackId && (
                        <AIComposerPopover
                            onClose={() => setIsAIModalOpen(false)}
                            onGenerated={(notes, requestId) => {
                                setClip(currentPatternId, selectedTrackId, notes);
                                console.log("AI Request Success:", requestId);
                                // Popover handles its own state switch to feedback
                            }}
                        />
                    )}
                </div>
            </ModuleHeader>

            <div className={styles.content}>
                {/* Left Sidebar: Tracks */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <span>Tracks</span>
                        <button onClick={handleAddTrack} className={styles.addButton} title="Add Synth">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className={styles.trackList}>
                        {melodicTracks.map(track => {
                            const isSelected = selectedTrackId === track.id;
                            // We re-use selectedTrackId as the "Expanded" state effectively
                            // Or we can add a separate expansion state if we want selection != expansion.
                            // For now, Click header = Select + Expand is intuitive.

                            const volume = track.volume ?? 0.8;
                            const muted = track.muted ?? false;
                            // Output is 'insert-1' etc. Extract number for UI or show ID?
                            // DragInput expects number.
                            const outputStr = track.mixerChannelId || 'insert-1';
                            const outputValue = Number.parseInt(outputStr.replace('insert-', ''), 10) || 1;

                            const handleVolumeChange = (val: number) => {
                                updateTrackVolume(track.id, val / 100);
                            };

                            const handleMuteChange = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleTrackMute(track.id);
                            };

                            const handleOutputChange = (val: number) => {
                                updateTrackRouting(track.id, `insert-${val}`);
                            };

                            return (
                                <div key={track.id} className={styles.trackRow}>
                                    {/* Header Row */}
                                    <div
                                        className={`${styles.trackHeader} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => setSelectedTrackId(isSelected ? null : track.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setSelectedTrackId(isSelected ? null : track.id);
                                            }
                                        }}
                                    >
                                        <div className={styles.left}>
                                            <div className={`${styles.icon} ${isSelected ? styles.open : ''}`}>
                                                <ChevronRight size={14} />
                                            </div>
                                            <button
                                                className={styles.muteBtn}
                                                onClick={handleMuteChange}
                                                title={muted ? "Unmute" : "Mute"}
                                            >
                                                <Led active={!muted} color="#4CAF50" size={8} />
                                            </button>
                                            <span className={styles.name}>{track.name || `Track ${track.id.slice(0, 4)}`}</span>
                                        </div>

                                        <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
                                            {/* Volume */}
                                            <div style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
                                                <Knob value={volume * 100} size={28} min={0} max={100} onChange={handleVolumeChange} label="Vol" hideLabel />
                                            </div>
                                            {/* Output */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <span style={{ fontSize: '0.6rem', color: '#666' }}>CI</span>
                                                <DragInput value={outputValue} min={1} max={10} onChange={handleOutputChange} label="Out" hideLabel />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collapsible Drawer */}
                                    <div className={`${styles.trackDrawer} ${isSelected ? styles.open : ''}`}>
                                        {isSelected && (
                                            <SynthPanel trackId={track.id} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main: Piano Roll */}
                <main className={styles.mainArea}>
                    {selectedTrackId ? (
                        <PianoRoll
                            trackId={selectedTrackId}
                            patternId={currentPatternId}
                            isPlaying={isPlaying}
                            playingStep={playingStep}
                        />
                    ) : (
                        <div className={styles.emptyState}>Select or Create a Track</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SynthLab;
