import React, { useMemo, useRef } from 'react';
import AudioEngine from '../../../audio/AudioEngine';
import { useProjectStore } from '../../../store/projectStore';
import type { Note } from '../../../store/projectStore';
import '../../../styles/components/_piano-roll.scss';

interface PianoRollProps {
    trackId: string;
    patternId: string;
    isPlaying?: boolean;
    playingStep?: number;
}

const PianoRoll: React.FC<PianoRollProps> = ({
    trackId,
    patternId,
    isPlaying = false,
    playingStep = -1,
}) => {
    // --- Store Access ---
    const { project, addNote: storeAddNote, removeNote: storeRemoveNote, updateNote: storeUpdateNote } = useProjectStore();

    // Retrieve Track Data from Project Store
    const pattern = project.melodicPatterns[patternId];
    // New Structure: Clips
    const notes = pattern?.clips?.[trackId] || [];

    const STEP_WIDTH = 40; // px, Must match SCSS background-size
    const VISIBLE_STEPS = 32;

    // Refs for Scroll Synchronization
    const gridRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    // Range: C2 (36) to B5 (83)
    const MIN_NOTE = 36;
    const MAX_NOTE = 83;

    // --- Resizing State ---
    const [dragState, setDragState] = React.useState<{
        note: Note;
        startX: number;
        originalDurationSteps: number;
        currentDurationSteps: number;
    } | null>(null);

    // Helper functions
    const isBlackKey = (note: number) => {
        const n = note % 12;
        return [1, 3, 6, 8, 10].includes(n);
    };

    const getNoteLabel = (note: number) => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(note / 12) - 1;
        const n = note % 12;
        return `${notes[n]}${octave}`;
    };

    const stepToTime = (step: number) => {
        const bars = Math.floor(step / 16);
        const beats = Math.floor((step % 16) / 4);
        const sixteenths = step % 4;
        return `${bars}:${beats}:${sixteenths}`;
    };

    const timeToStep = (time: string) => {
        const [bars, beats, sixteenths] = time.split(':').map(Number);
        return (bars * 16) + (beats * 4) + sixteenths;
    };

    const durationToSteps = (duration: string) => {
        if (duration === "16n") return 1;
        if (duration === "8n") return 2;
        if (duration === "4n") return 4;
        if (duration.includes(":")) return timeToStep(duration);
        return 1;
    };

    const stepsToDuration = (steps: number) => {
        if (steps === 1) return "16n";
        if (steps === 2) return "8n";
        if (steps === 4) return "4n";
        return stepToTime(steps); // Format x:x:x for arbitrary lengths
    };

    // --- GLOBAL DRAG HANDLERS ---
    React.useEffect(() => {
        if (!dragState) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragState.startX;
            const deltaSteps = Math.round(deltaX / STEP_WIDTH);
            const newDuration = Math.max(1, dragState.originalDurationSteps + deltaSteps);

            if (newDuration !== dragState.currentDurationSteps) {
                setDragState(prev => prev ? { ...prev, currentDurationSteps: newDuration } : null);
            }
        };

        const handleMouseUp = () => {
            // Commit Change
            if (dragState.currentDurationSteps !== dragState.originalDurationSteps) {
                const newNote = {
                    ...dragState.note,
                    duration: stepsToDuration(dragState.currentDurationSteps)
                };
                storeUpdateNote(patternId, trackId, dragState.note, newNote);
            }
            setDragState(null);
        };

        globalThis.addEventListener('mousemove', handleMouseMove);
        globalThis.addEventListener('mouseup', handleMouseUp);
        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            globalThis.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState, patternId, trackId, storeUpdateNote]);


    // Handle Grid Click (Add Note)
    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>, noteNumber: number) => {
        if (dragState) return; // Ignore clicks while resizing

        const offsetX = e.nativeEvent.offsetX;
        const clickStep = Math.floor(offsetX / STEP_WIDTH);

        if (clickStep < 0 || clickStep >= VISIBLE_STEPS) return;

        const noteLabel = getNoteLabel(noteNumber);

        // Check if note exists (Redundant if clicking on Note div, but good fallback)
        const existingNoteIndex = notes.findIndex(n =>
            n.note === noteLabel && timeToStep(n.time) === clickStep
        );
        const existingNote = notes[existingNoteIndex];

        if (existingNote) {
            // Handled by Note Click
        } else {
            const newNote: Note = {
                note: noteLabel,
                time: stepToTime(clickStep),
                duration: "16n",
                velocity: 0.8
            };
            storeAddNote(patternId, trackId, newNote);
            const track = AudioEngine.tracks.get(trackId);
            if (track) {
                if (track.type === 'synth' && track.polySynth) {
                    track.polySynth.triggerAttackRelease(noteLabel, "8n");
                } else if (track.type === 'sampler' && track.sampler) {
                    track.sampler.triggerAttack(noteLabel);
                }
            }
        }
    };

    // Handle Note Click (Remove / Delete)
    const handleNoteClick = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation(); // Stop grid click
        // Only delete if NOT resizing (handled by dragState check usually but precise click needed)
        // Since resize handle stops propagation too, a click on Body is a delete.
        storeRemoveNote(patternId, trackId, note);
    };

    const handleResizeMouseDown = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent text selection
        setDragState({
            note,
            startX: e.clientX,
            originalDurationSteps: durationToSteps(note.duration),
            currentDurationSteps: durationToSteps(note.duration)
        });
    };

    // Generate Rows (Notes)
    const rows = useMemo(() => {
        const r = [];
        for (let i = MAX_NOTE; i >= MIN_NOTE; i--) {
            r.push(i);
        }
        return r;
    }, []);

    const stepCols = useMemo(() => Array.from({ length: VISIBLE_STEPS }, (_, i) => i), []);

    return (
        <div data-testid="piano-roll-container" className="piano-roll">

            {/* Controls Bar - Adjusted for 32 steps */}
            <div className="piano-roll__controls">
                <div className="controls-left">
                    <h3 className="piano-roll-title">Piano Roll (Track {trackId})</h3>

                    <div className="controls-separator"></div>


                    {/* Pagination removed if only 1 page (32 steps) */}
                    {/* Or kept if we support longer patterns later */}
                </div>
            </div>

            {/* Single Scroll Container */}
            <div className="piano-roll__scroller" ref={scrollerRef}>
                <div className="piano-roll__content" style={{ minWidth: `${VISIBLE_STEPS * STEP_WIDTH + 60}px`, position: 'relative' }}>

                    {/* PLAYHEAD OVERLAY */}
                    {isPlaying && (playingStep !== undefined && playingStep >= 0) && (
                        <div
                            data-testid="playhead"
                            className="piano-roll__playhead"
                            style={{
                                left: `${(playingStep * STEP_WIDTH) + 60}px`,
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                width: '2px',
                                backgroundColor: '#f44336',
                                zIndex: 100,
                                pointerEvents: 'none',
                                boxShadow: '0 0 4px rgba(244, 67, 54, 0.8)'
                            }}
                        />
                    )}

                    {/* 1. Header Row (Sticky TOP) */}
                    <div className="piano-roll__header" ref={headerRef}>
                        <div className="piano-roll__corner"></div>
                        <div className="piano-roll__timeline" style={{ width: `${VISIBLE_STEPS * STEP_WIDTH}px` }}>
                            {stepCols.map((step) => {
                                const isBeatStart = step % 4 === 0;
                                return (
                                    <div
                                        key={step}
                                        className="piano-roll__header-step"
                                        data-is-beat={isBeatStart}
                                    >
                                        {step + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Note Rows */}
                    <div className="piano-roll__body" ref={gridRef}>
                        {rows.map((note) => {
                            const noteLabel = getNoteLabel(note);
                            const black = isBlackKey(note);
                            const rowNotes = notes.filter(n => n.note === noteLabel);

                            return (
                                <div key={note} className="piano-roll__row">
                                    <div className="piano-roll__key" data-is-black={black}>
                                        <span className="piano-roll__key-label">{noteLabel}</span>
                                    </div>

                                    <div
                                        className="piano-roll__grid-row"
                                        data-is-black={black}
                                        onClick={(e) => handleGridClick(e, note)}
                                        role="button"
                                        tabIndex={0}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGridClick(e as any, note); }}
                                        style={{ width: `${VISIBLE_STEPS * STEP_WIDTH}px` }}
                                    >
                                        {rowNotes.map((n, idx) => {
                                            const startStep = timeToStep(n.time);
                                            // Safety: if step out of bounds (legacy/other pattern), skip?
                                            // if (startStep >= VISIBLE_STEPS) return null; 

                                            // Determine duration: if dragging THIS note, use temp state, else use proper duration
                                            const isDraggingThis = dragState?.note.time === n.time && dragState?.note.note === n.note;
                                            const displaySteps = isDraggingThis ? dragState.currentDurationSteps : durationToSteps(n.duration);

                                            return (
                                                <div
                                                    key={`${n.time}-${idx}`}
                                                    className="piano-roll__note"
                                                    style={{
                                                        left: `${startStep * STEP_WIDTH}px`,
                                                        width: `${displaySteps * STEP_WIDTH - 2}px`
                                                    }}
                                                    onClick={(e) => handleNoteClick(e, n)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                >
                                                    <div
                                                        className="resize-handle"
                                                        onMouseDown={(e) => handleResizeMouseDown(e, n)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: 0,
                                                            bottom: 0,
                                                            width: '10px',
                                                            cursor: 'ew-resize',
                                                            backgroundColor: 'rgba(255,255,255,0.3)'
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PianoRoll;
