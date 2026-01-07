import React, { useEffect, useRef } from 'react';
import audioInstance from '../../audio/AudioEngine';
import * as Tone from 'tone';

interface VUMeterProps {
    trackId: string;
    width?: number;
    stereo?: boolean;
    channel?: 'left' | 'right' | 'stereo' | 'mono'; // Enhanced prop
}

const VUMeter: React.FC<VUMeterProps> = ({ trackId, width = 6, stereo = false, channel = 'mono' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    // Internal High Resolution for Canvas logic, scaled down by CSS
    const INTERNAL_HEIGHT = 400;

    const draw = (ctx: CanvasRenderingContext2D) => {
        let levelL = -100;
        let levelR = -100;

        // 1. Fetch Levels
        const levels = audioInstance.getStereoLevels(trackId);
        levelL = levels.l;
        levelR = levels.r;

        // Fallback for Mono/Legacy logic if getStereoLevels returned -100 (not found) but standard meters exist?
        // Actually getStereoLevels handles fallback to -100.
        // If we want to support "Mono" mode strictly for non-stereo tracks, we can average them?
        // But for visualization, showing the Max or L/R is fine.

        // If we are in "Mono" mode (default prop), we might want to sum them or pick max
        if (!stereo && channel === 'mono') {
            // If we have distinct L/R, take max to ensure visibility even if panned
            levelL = Math.max(levelL, levelR);
            levelR = levelL;
        }

        // 2. Clear
        ctx.clearRect(0, 0, width, INTERNAL_HEIGHT);
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, width, INTERNAL_HEIGHT);

        // 3. Helper to draw a single bar
        const drawBar = (levelDb: number, x: number, w: number) => {
            // normalize from -60db to 0db
            let norm = (levelDb + 60) / 60;
            if (norm < 0) norm = 0;
            if (norm > 1.2) norm = 1.2;

            const segmentHeight = 3;
            const gap = 1;
            const segments = Math.floor(INTERNAL_HEIGHT / (segmentHeight + gap));
            const activeSegments = Math.floor(norm * segments);

            for (let i = 0; i < segments; i++) {
                const y = INTERNAL_HEIGHT - (i * (segmentHeight + gap)) - segmentHeight;

                // Color Logic
                let color = '#333'; // Inactive
                if (i < activeSegments) {
                    const pct = i / segments;
                    if (pct < 0.7) color = '#00ff00'; // Green
                    else if (pct < 0.9) color = '#ffff00'; // Yellow
                    else color = '#ff0000'; // Red
                }

                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, segmentHeight);
            }
        };

        if (channel === 'left') {
            drawBar(levelL, 0, width);
        } else if (channel === 'right') {
            drawBar(levelR, 0, width);
        } else if (stereo) {
            // Dual Bar (Legacy prop support)
            const barWidth = (width - 2) / 2; // 2px gap
            drawBar(levelL, 0, barWidth);
            drawBar(levelR, barWidth + 2, barWidth);
        } else {
            // Single Bar (Mono)
            drawBar(levelL, 0, width);
        }
    };

    const animate = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) draw(ctx);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [trackId, stereo, channel]);

    return (
        <canvas
            ref={canvasRef}
            width={width} // Note: If stereo, passed width should likely be wider
            height={INTERNAL_HEIGHT} // High Res internal
            style={{ borderRadius: 2, height: '100%', width: '100%', display: 'block' }} // CSS Stretch
        />
    );
};

export default VUMeter;
