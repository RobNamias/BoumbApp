import React, { useRef } from 'react';
import '../../styles/components/_step-cell.scss';

export interface StepCellProps {
    isActive?: boolean;
    isPlaying?: boolean;
    mode?: 'trigger' | 'volume' | 'fill';
    value?: number;
    onClick?: () => void;
    onChange?: (value: number) => void;
    isAltBeat?: boolean;
}

const StepCell: React.FC<StepCellProps> = ({
    isActive = false,
    isPlaying = false,
    mode = 'trigger',
    value = 1,
    onClick,
    onChange,
    isAltBeat = false
}) => {
    // DEBUG: Trace Prop Reception
    if (isActive) {
        // console.log(`StepCell Active! Mode: ${mode}, Value: ${value}`);
    }

    // Refs for Drag Logic
    const startY = useRef<number | null>(null);
    const startValue = useRef<number>(value);
    const isDragging = useRef(false);

    // Fill Mode: Display text fraction or distinct bars
    const renderFillContent = () => {
        // Map decimal value back to fraction for display 
        // 1.0 -> "1", 0.5 -> "1/2", 0.33 -> "1/3", 0.25 -> "1/4"
        let text = "";
        if (value >= 0.9) text = "1";
        else if (value >= 0.45) text = "1/2";
        else if (value >= 0.3) text = "1/3";
        else text = "1/4";

        return <span className="step-cell__fill-text">{text}</span>;
    };

    // --- Pointer Events for Volume Drag ---
    const handlePointerDown = (e: React.PointerEvent) => {
        if (mode === 'volume') {
            e.currentTarget.setPointerCapture(e.pointerId);
            startY.current = e.clientY;
            startValue.current = value;
            isDragging.current = false;
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (mode === 'volume' && startY.current !== null) {
            const deltaY = startY.current - e.clientY; // Drag UP increases value

            // Threshold to detect drag vs click
            if (Math.abs(deltaY) > 5) {
                isDragging.current = true;
            }

            if (isDragging.current && onChange) {
                // Sensitivity: 150px = Full Range 0-1
                const change = deltaY / 150;
                let newValue = startValue.current + change;

                // Clamp and Quantize (Step 0.1)
                newValue = Math.max(0, Math.min(1, newValue));
                newValue = Math.round(newValue * 10) / 10;

                onChange(newValue);
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (mode === 'volume' && startY.current !== null) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            startY.current = null;

            if (!isDragging.current) {
                // It was a click
                onClick?.();
            }
            isDragging.current = false;
        }
    };

    return (
        <button
            className={`step-cell step-cell--${mode} ${isActive ? 'step-cell--active' : ''} ${isPlaying ? 'step-cell--playing' : ''} ${isAltBeat ? 'step-cell--alt-beat' : ''}`}

            // Event Handling: Volume uses Pointer for Drag/Click, others use standard Click
            onPointerDown={mode === 'volume' ? handlePointerDown : undefined}
            onPointerMove={mode === 'volume' ? handlePointerMove : undefined}
            onPointerUp={mode === 'volume' ? handlePointerUp : undefined}
            onClick={mode !== 'volume' ? onClick : undefined}

            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}

            type="button"
            aria-label={`Step ${mode}`}
            // Prevent scrolling when dragging volume
            style={mode === 'volume' ? { touchAction: 'none' } : undefined}
        >
            {/* VOLUME MODE: Vertical Bar */}
            {mode === 'volume' && isActive && (
                <div
                    className="step-cell__bar"
                    style={{ height: `${Math.min(100, Math.max(0, value * 100))}%` }}
                />
            )}

            {/* FILL MODE: Text/Icon representation */}
            {mode === 'fill' && isActive && renderFillContent()}

            {/* TRIGGER MODE: Led */}
            {mode === 'trigger' && isActive && <div className="step-cell__led" />}
        </button>
    );
};

export default StepCell;
