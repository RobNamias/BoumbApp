import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProjectStore } from '../../../store/projectStore';
import audioInstance from '../../../audio/AudioEngine';

const TimelineDebugOverlay: React.FC = () => {
    const { playMode, playingStep, isPlaying } = useAppStore();
    const { activePatterns, project } = useProjectStore();
    const [engineTime, setEngineTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEngineTime(audioInstance.getCurrentTime());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Matrix Rain Effect
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 300; // Fixed width for the panel
        canvas.height = 200;

        const columns = Math.floor(canvas.width / 10);
        const drops: number[] = Array(columns).fill(1);

        // Matrix Characters (Katakana + Latin)
        const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ1234567890';

        const drawMatch = () => {
            // Translucent black for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Matrix Green
            ctx.font = '10px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 10, drops[i] * 10);

                if (drops[i] * 10 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const intervalId = setInterval(drawMatch, 50);
        return () => clearInterval(intervalId);
    }, []);

    // Resolve Active Clip Names
    const drumPatternName = project.drumPatterns[activePatterns.drums || '']?.name || 'None';
    const melodyPatternName = project.melodicPatterns[activePatterns.melody || '']?.name || 'None';

    // Status Indicator Logic
    const getStatusIndicator = () => {
        if (isPlaying) return <span style={{ color: '#0f0' }}>▶ PLAYING</span>;
        return <span style={{ color: '#ff0', animation: 'blink 1.5s infinite' }}>⏸ READY</span>;
    };

    // Safe ASCII Bar (Fixes RangeError)
    const renderBar = (val: number, max: number = 10) => {
        const safeVal = Math.max(0, val); // Clamp negative values
        const filled = Math.floor((safeVal % max));
        const safeFilled = Math.max(0, Math.min(filled, max)); // Double safeguard
        return '[' + '#'.repeat(safeFilled) + '-'.repeat(max - safeFilled) + ']';
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: '320px',
            backgroundColor: 'rgba(0, 5, 0, 0.9)',
            color: '#0f0',
            fontFamily: "'Courier New', monospace",
            borderRadius: '4px',
            fontSize: '11px',
            pointerEvents: 'none',
            zIndex: 9999,
            border: '1px solid #0f0',
            boxShadow: '0 0 10px #0f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Matrix Background */}
            <canvas ref={canvasRef} style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                opacity: 0.5, // Increased from 0.2
                zIndex: 0
            }} />

            {/* Scanline Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 2px 100%',
                pointerEvents: 'none',
                zIndex: 1
            }} />

            <div style={{ padding: '12px', zIndex: 2, position: 'relative', textShadow: '0 0 2px #0f0' }}>
                <div style={{ borderBottom: '1px solid #0f0', paddingBottom: '4px', marginBottom: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    <span>SYSTEM_MONITOR_V2.0</span>
                    {getStatusIndicator()}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                        <div style={{ color: '#005500' }}>STATUS</div>
                        <div>{isPlaying ? '>> RUNNING' : '|| PAUSED'}</div>
                    </div>
                    <div>
                        <div style={{ color: '#005500' }}>MODE</div>
                        <div style={{ color: playMode === 'SKYLINE' ? '#aff' : '#ff0' }}>[{playMode}]</div>
                    </div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                    <div>TIMER: {engineTime.toFixed(3)}s</div>
                    <div>STEP : {playingStep.toString().padStart(3, '0')} {renderBar(playingStep, 16)}</div>
                    <div>CPU  : {renderBar(Date.now() / 100, 10)}</div>
                </div>

                <div style={{ borderTop: '1px dashed #005500', paddingTop: '4px', marginTop: '4px' }}>
                    <div style={{ color: '#005500' }}>ACTIVE_TASKS:</div>
                    <div>DRM: {drumPatternName}</div>
                    <div>SYN: {melodyPatternName}</div>
                </div>
            </div>

            <style>
                {`
                    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
                `}
            </style>
        </div>
    );
};

export default TimelineDebugOverlay;
