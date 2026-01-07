import React from 'react';
import Button from '../atoms/Button';
import Led from '../atoms/Led';
import TimeDisplay from '../atoms/TimeDisplay';
import '../../styles/components/_transport-controls.scss';
import { Repeat, AudioLines } from 'lucide-react';

export interface TransportControlsProps {
    isPlaying?: boolean;
    isPaused?: boolean;
    isRecording?: boolean;
    bpm?: number;
    onPlay?: () => void;
    onPause?: () => void;
    onStop?: () => void;
    onRecord?: () => void;
    onBpmChange?: (bpm: number) => void;
    playMode?: 'PATTERN' | 'SKYLINE';
    onToggleMode?: () => void;
    currentStep?: number;
}

const TransportControls: React.FC<TransportControlsProps> = ({
    isPlaying = false,
    isPaused = false,
    isRecording = false,
    bpm = 120,
    onPlay,
    onPause,
    onStop,
    onRecord,
    onBpmChange,
    playMode = 'PATTERN',
    onToggleMode,
    currentStep = 0
}) => {
    return (
        <div className="transport-controls">
            <div className="transport-controls__group">
                <TimeDisplay step={currentStep} />

                <div className="transport-controls__bpm">
                    <span className="transport-controls__bpm-label">BPM</span>
                    <input
                        type="number"
                        className="transport-controls__bpm-input"
                        value={bpm}
                        onChange={(e) => onBpmChange?.(Number(e.target.value))}
                        aria-label="BPM"
                    />
                </div>

                <Button
                    variant={isPlaying ? 'primary' : 'secondary'}
                    onClick={onPlay}
                    aria-label="Play"
                >
                    ▶
                </Button>
                <Button
                    variant={isPaused ? 'primary' : 'secondary'}
                    onClick={onPause}
                    aria-label="Pause"
                >
                    ⏸
                </Button>
                <Button
                    variant="secondary"
                    onClick={onStop}
                    aria-label="Stop"
                >
                    ⏹
                </Button>
            </div>

            {/* Loop Toggle */}
            <div className="transport-controls__group">
                <Button
                    variant={playMode === 'SKYLINE' ? 'primary' : 'secondary'}
                    onClick={onToggleMode}
                    aria-label="Toggle Play Mode"
                    title={playMode === 'SKYLINE' ? 'Mode: Skyline (Song)' : 'Mode: Pattern (Loop)'}
                >
                    {playMode === 'SKYLINE' ? <AudioLines size={18} /> : <Repeat size={18} />}
                </Button>
            </div>

            <div className="transport-controls__rec-wrapper">
                <Button
                    variant={isRecording ? 'primary' : 'secondary'} // Should ideally be red variant
                    onClick={onRecord}
                    aria-label="Record"
                    style={isRecording ? { backgroundColor: '#ff4444', borderColor: '#ff4444' } : {}}
                    className={isRecording ? 'btn--recording' : ''}
                >
                    ⏺
                </Button>
                <Led active={isRecording} color="#ff0000" size={10} />
            </div>
        </div>
    );
};

export default TransportControls;
