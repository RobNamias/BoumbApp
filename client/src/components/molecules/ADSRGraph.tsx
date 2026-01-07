import React, { useEffect, useRef } from 'react';

interface ADSRGraphProps {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    width?: number;
    height?: number;
    color?: string;
}

const ADSRGraph: React.FC<ADSRGraphProps> = ({
    attack,
    decay,
    sustain,
    release,
    width = 200,
    height = 100,
    color = '#4CAF50'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Styling
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');

        // Logic to Map Time/Level to X/Y
        // Sustain Level is 0-1 mapped to Height
        // Times (A, D, R) need to sum up to fit in Width or be relative?
        // Let's assume a fixed total max duration for the view, say 2 seconds?
        // Or simply apportion graphical space: 25% Attack, 25% Decay... No, that's misleading.
        // Better: 
        // Max range for display = 2s ?
        // If total > 2s, we compress.

        const totalDuration = Math.max(attack + decay + release + 0.5, 2); // +0.5 for hold duration visual
        const timeScale = width / totalDuration;

        const startX = 0;
        const startY = height;

        // Attack Point (Time = A, Level = 1.0)
        const attackX = startX + (attack * timeScale);
        const attackY = 0; // Top

        // Decay Point (Time = A + D, Level = S)
        const decayX = attackX + (decay * timeScale);
        const decayY = height - (sustain * height);

        // Sustain Hold (Time = A + D + Hold, Level = S)
        const holdDuration = 0.5; // Visual constant for key held down
        const sustainX = decayX + (holdDuration * timeScale);
        const sustainY = decayY;

        // Release Point (Time = End, Level = 0)
        const releaseX = sustainX + (release * timeScale);
        const releaseY = height;

        // Draw Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(attackX, attackY);
        ctx.lineTo(decayX, decayY);
        ctx.lineTo(sustainX, sustainY);
        ctx.lineTo(releaseX, releaseY);

        ctx.stroke();

        // Fill
        ctx.lineTo(releaseX, height);
        ctx.lineTo(startX, height);
        ctx.fill();

    }, [attack, decay, sustain, release, width, height, color]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="adsr-graph"
            style={{ border: '1px solid #333', borderRadius: '4px', background: '#111' }}
        />
    );
};

export default ADSRGraph;
