import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Knob from '../atoms/Knob';
import Button from '../atoms/Button';
import DragInput from '../atoms/DragInput';
import Led from '../atoms/Led';

// Decoupled from Store - Pure UI Component
export interface Track {
    id: string; // Changed to string for UUID support
    name: string;
    sample: string;
    volume: number;
    pan: number;
    solo: boolean;
    muted: boolean;
    output?: string;
    steps: (number | { active: boolean; value: number; volume?: number; fill?: number; })[];
    isMuted?: boolean; // Prop from container (computed or direct)
    isSolo?: boolean; // Prop from container
}

export interface TrackHeaderProps {
    track: Track;
    onVolumeChange?: (val: number) => void;
    onMuteChange?: (muted: boolean) => void;
    onSoloChange?: (solo: boolean) => void;
    onOutputChange?: (val: number) => void;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({
    track,
    onVolumeChange,
    onMuteChange,
    onSoloChange,
    onOutputChange
}) => {
    // DnD Drop Zone (Target for Sample Load)
    const { setNodeRef, isOver } = useDroppable({
        id: `track-header-${track.id}`,
        data: { type: 'track-target', trackId: track.id }
    });



    // Normalized Values
    const volume = track.volume ?? 0.8;
    const muted = track.isMuted ?? track.muted ?? false;
    const solo = track.isSolo ?? track.solo ?? false;

    // Helper to parse 'insert-X' (or legacy 'ciX') to number. Default to 1 if NaN.
    // The store uses "insert-1", "insert-2", etc.
    const rawVal = Number.parseInt((track.output || 'insert-1').replace(/^(insert-|ci)/, ''), 10);
    const outputValue = Number.isNaN(rawVal) ? 1 : rawVal;

    // Connect Output Selection
    const handleOutputChange = (val: number) => {
        onOutputChange?.(val);
    };

    return (
        <div
            ref={setNodeRef}
            className={`track-header ${isOver ? 'drag-over' : ''}`}
            style={{
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
            }}
        >
            {/* LEFT COL: Solo & Mute (Vertical) */}
            <div className="track-header__left">
                {/* Mute Led */}
                <button
                    className="control-led-wrapper"
                    onClick={() => onMuteChange?.(!muted)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onMuteChange?.(!muted);
                        }
                    }}
                    title={muted ? "Unmute" : "Mute"}
                    type="button"
                    aria-label={muted ? "Unmute Track" : "Mute Track"}
                >
                    <Led active={!muted} color="#4caf50" size={10} />
                </button>

                {/* Solo Btn */}
                <Button
                    size="sm"
                    variant="secondary"
                    className={solo ? 'btn--warning' : ''}
                    onClick={() => onSoloChange?.(!solo)}
                    aria-label="Solo"
                    title={solo ? "Disable Solo" : "Solo Track"}
                    style={{
                        padding: '0',
                        width: '20px',
                        height: '20px',
                        fontSize: '10px',
                        minWidth: 'unset',
                        borderRadius: '2px',
                        lineHeight: '20px',
                        // Visual State: Illuminated (Yellow/White) vs Off (Dark/Gray)
                        color: solo ? '#FFF' : '#555',
                        backgroundColor: solo ? undefined : '#222', // Undefined lets btn--warning take over
                        borderColor: solo ? undefined : '#333'
                    }}
                >S</Button>
            </div>

            {/* RIGHT COL: Name & Controls */}
            <div className="track-header__right">
                {/* Row 1: Name */}
                {/* Row 1: Name (Sample Name) */}
                <div className="track-header__right-top">
                    <span
                        className="track-name"
                        title={track.name} // Keep original name as tooltip
                        style={{
                            fontSize: '0.85em',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            display: 'block'
                        }}
                    >
                        {(() => {
                            if (!track.sample) return track.name;

                            // Extract Kit Name if present: samples/kits/808/Kick.ogg -> 808
                            const kitMatch = track.sample.match(/kits\/([^/]+)\//);
                            const fileName = track.sample.split('/').pop()?.replace(/\.[^/.]+$/, "") || track.sample;

                            if (kitMatch) {
                                return `${fileName} (${kitMatch[1]})`;
                            }
                            return fileName;
                        })()}
                    </span>
                </div>

                {/* Row 2: Knob & DragInput */}
                <div className="track-header__right-bottom">
                    <Knob
                        value={volume * 100}
                        min={0}
                        max={100}
                        size={24}
                        aria-label="Volume"
                        onChange={(val) => onVolumeChange?.(val / 100)}
                    />

                    {/* Spacer */}
                    <div style={{ width: '8px' }}></div>

                    {/* Drag Input for CI */}
                    <div className="track-output-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.6rem', color: '#666', marginRight: '2px' }}>CI</span>
                        <DragInput
                            value={outputValue}
                            min={1}
                            max={4}
                            onChange={handleOutputChange}
                            label="Output Channel"
                            hideLabel
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackHeader;
