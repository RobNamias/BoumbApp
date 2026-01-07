import React from 'react';

interface TimeDisplayProps {
    step: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ step }) => {
    // 1 Bar = 16 steps (4 beats of 4 steps)
    const bar = Math.floor(step / 16) + 1;
    const beat = Math.floor((step % 16) / 4) + 1;
    const microStep = (step % 4) + 1;

    const format = (n: number) => n.toString().padStart(2, '0');
    const formatBar = (n: number) => n.toString().padStart(3, '0');

    return (
        <div style={{
            fontFamily: "'Inter', 'Roboto Mono', monospace",
            fontSize: '13px',
            color: '#e0e0e0',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '110px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
        }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{formatBar(bar)}</span>
            <span style={{ color: '#666' }}>:</span>
            <span>{format(beat)}</span>
            <span style={{ color: '#666' }}>:</span>
            <span style={{ color: '#aaa' }}>{format(microStep)}</span>
        </div>
    );
};

export default TimeDisplay;
