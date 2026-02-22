import React, { useRef, useEffect, useState } from "react";
import "../../styles/components/_fader.scss";

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
  height = "100%",
  label,
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const localValueRef = useRef(value);
  const lastUpdateRef = useRef(0);

  // Normalize value
  const displayValue = isDragging ? localValue : value;
  const clampedValue = Math.min(Math.max(displayValue, min), max);
  const percentage = max === min ? 0 : (clampedValue - min) / (max - min);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const offsetY = rect.bottom - e.clientY;
    const pct = Math.min(Math.max(offsetY / rect.height, 0), 1);
    const val = min + pct * (max - min);

    setLocalValue(val);
    localValueRef.current = val;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onChange) return;
    const step = (max - min) / 100; // 1% step for keyboard

    let newValue: number;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      newValue = Math.min(clampedValue + step, max);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
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
        if (!trackRef.current || !onChange) return;
        const rect = trackRef.current.getBoundingClientRect();
        const offsetY = rect.bottom - e.clientY;
        const pct = Math.min(Math.max(offsetY / rect.height, 0), 1);
        const val = min + pct * (max - min);

        setLocalValue(val);
        localValueRef.current = val;

        const now = Date.now();
        if (now - lastUpdateRef.current > 80) {
          onChange(val);
          lastUpdateRef.current = now;
        }
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      if (onChange) onChange(localValueRef.current);
    };

    if (isDragging) {
      globalThis.addEventListener("mousemove", handleMouseMove);
      globalThis.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, max, min, onChange]);

  return (
    <div
      className={`fader ${isDragging ? "fader--active" : ""}`}
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
      {}
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
