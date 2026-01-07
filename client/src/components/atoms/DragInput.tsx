import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/components/_drag-input.scss';

export interface DragInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    label?: string;
    hideLabel?: boolean;
    sensitivity?: number; // Pixels per value unit
}

const DragInput: React.FC<DragInputProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    label,
    hideLabel = false,
    sensitivity = 2 // Higher = slower
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startValue, setStartValue] = useState(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();

        // Delta Y: Dragging UP (negative clientY delta) should INCREASE value
        const deltaY = startY - e.clientY;
        const deltaValue = Math.floor(deltaY / sensitivity);

        let newValue = startValue + deltaValue;

        // Clamp
        newValue = Math.min(Math.max(newValue, min), max);

        if (newValue !== value) {
            onChange(newValue);
        }
    }, [isDragging, startY, startValue, min, max, sensitivity, value, onChange]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        globalThis.document.body.style.cursor = '';
        globalThis.document.body.style.userSelect = '';
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartY(e.clientY);
        setStartValue(value);
        globalThis.document.body.style.cursor = 'ns-resize';
        globalThis.document.body.style.userSelect = 'none';
        e.preventDefault(); // Prevent text selection
    };

    useEffect(() => {
        if (isDragging) {
            globalThis.addEventListener('mousemove', handleMouseMove);
            globalThis.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            globalThis.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
         
        <div
            className={`drag-input ${isDragging ? 'drag-input--active' : ''}`}
            role="spinbutton"
            tabIndex={0}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label}
        >
            <span className="drag-input__value">{value}</span>
            {!hideLabel && <span className="drag-input__label">{label}</span>}
            {/* Hidden input for accessibility/forms */}
            <input
                type="hidden"
                value={value}
                name={label}
                readOnly
            />
            {/* Visual overlay for dragging */}
            { }
            <div
                className="drag-input__overlay"
                onMouseDown={onMouseDown}
                style={{ cursor: 'ns-resize', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
            />
        </div>
    );
};

export default DragInput;
