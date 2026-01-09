import React, { useRef, useEffect, useState } from 'react';
import '../../styles/components/_knob.scss';

export interface KnobProps {
    value?: number;
    min?: number;
    max?: number;
    size?: number;
    label?: string;
    onChange?: (value: number) => void;
    [key: string]: any; // Allow other props
}

const Knob: React.FC<KnobProps> = ({
    value = 0,
    min = 0,
    max = 100,
    size = 60,
    label,
    onChange,
    hideLabel, // Extract to prevent DOM leak
    ...props
}) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startValue = useRef(0);

    // Normalize value to 0-1 range (clamped)
    const clampedValue = Math.min(Math.max(value, min), max);
    const normalizedValue = (clampedValue - min) / (max - min);

    // Angle: -135 to 135 (Total 270)
    const angle = normalizedValue * 270 - 135;

    // SVG Geometry
    const radius = size / 2;
    const center = size / 2;
    const pointerLength = radius * 0.7;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = clampedValue;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!onChange) return;

        const step = (max - min) / 100; // 1% step
        let newValue: number;

        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            newValue = Math.min(clampedValue + step, max);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            newValue = Math.max(clampedValue - step, min);
        } else {
            return;
        }

        e.preventDefault();
        onChange(newValue);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !onChange) return;
            const deltaY = startY.current - e.clientY; // Drag up to increase
            const range = max - min;
            // 200px drag = full range
            const deltaValue = (deltaY / 200) * range;

            let newValue = startValue.current + deltaValue;
            newValue = Math.min(Math.max(newValue, min), max); // Clamp

            onChange(newValue);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            globalThis.addEventListener('mousemove', handleMouseMove);
            globalThis.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            globalThis.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, max, min, onChange]);

    return (

        <div
            className={`knob ${isDragging ? 'knob--active' : ''}`}
            role="slider"
            aria-valuenow={clampedValue}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label}
            tabIndex={0}
            ref={knobRef}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            style={{ width: size, cursor: isDragging ? 'grabbing' : 'grab' }}
            {...props}
        >
            {label && <div className="knob__label">{label}</div>}
            <svg width={size} height={size} className="knob__svg">
                <circle
                    cx={center}
                    cy={center}
                    r={radius - 5}
                    className="knob__track"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <line
                    x1={center}
                    y1={center}
                    x2={center}
                    y2={center - pointerLength}
                    className="knob__pointer"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${angle}, ${center}, ${center})`}
                />
            </svg>
        </div>
    );
};

export default Knob;
