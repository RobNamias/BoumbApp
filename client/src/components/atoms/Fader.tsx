import React, { useRef, useEffect, useState } from 'react';
import '../../styles/components/_fader.scss';

export interface FaderProps {
    value?: number;
    min?: number;
    max?: number;
    height?: number | string;
    label?: string;
    onChange?: (value: number) => void;
}

const Fader: React.FC<FaderProps> = ({
    value = 0,
    min = 0,
    max = 100,
    height = '100%',
    label,
    onChange
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Normalize value
    const clampedValue = Math.min(Math.max(value, min), max);
    const percentage = (clampedValue - min) / (max - min);

    const updateValueFromPointer = (clientY: number) => {
        if (!trackRef.current || !onChange) return;

        const rect = trackRef.current.getBoundingClientRect();
        // Calculate relative Y (bottom is 0%, top is 100%)
        // clientY increases downwards.
        // rect.bottom is the higher pixel value.
        const offsetY = rect.bottom - clientY;

        let newIdsPercentage = offsetY / rect.height;
        newIdsPercentage = Math.min(Math.max(newIdsPercentage, 0), 1);

        const newValue = min + newIdsPercentage * (max - min);
        onChange(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateValueFromPointer(e.clientY);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!onChange) return;
        const step = (max - min) / 10; // 10% step for keyboard

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
            if (isDragging) {
                e.preventDefault();
                updateValueFromPointer(e.clientY);
            }
        };
        const handleMouseUp = () => setIsDragging(false);

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
            className={`fader ${isDragging ? 'fader--active' : ''}`}
            role="slider"
            aria-label={label}
            aria-orientation="vertical"
            aria-valuenow={clampedValue}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {label && <div className="fader__label">{label}</div>}
            { }
            <div
                className="fader__track"
                ref={trackRef}
                style={{ height: height }}
                onMouseDown={handleMouseDown}
            >
                <div
                    className="fader__thumb"
                    style={{ bottom: `${percentage * 100}%` }}
                />
            </div>
        </div>
    );
};

export default Fader;
