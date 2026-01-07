import React, { useEffect, useRef } from 'react';
import audioInstance from '../../audio/AudioEngine';
import * as Tone from 'tone';

interface SpectrumAnalyzerProps {
    width?: number;
    height?: number;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ width = 60, height = 40 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        // Initialize Analyser on Master
        // Increased size for better bass resolution (2048 = ~10hz bin)
        const analyser = new Tone.Analyser('fft', 2048);
        analyserRef.current = analyser;

        // Connect Global Master to this analyser
        // We tap into the Master Strip's Output (muteGain) which goes to Destination
        if (audioInstance.masterStrip?.muteGain) {
            audioInstance.masterStrip.muteGain.connect(analyser);
        } else if ((audioInstance as any).master) {
            // Fallback for legacy if any
            ((audioInstance as any).master).connect(analyser);
        } else {
            // Fallback: Connect directly to Tone.Destination (might capture everything going to speakers)
            // Tone.Destination.connect(analyser); // Tone.Destination is an Output, not something we can tap? 
            // Actually we can connect Destination to Analyser? No, Destination is a Sink.
            // We need to tap BEFORE Destination.
            console.warn("[SpectrumAnalyzer] Could not find Master Output to connect to.");

            // Try to force ensure channels?
            // audioInstance._ensureChannels(); // Private
        }

        const draw = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const values = analyserRef.current.getValue();
            // values is Float32Array of Db

            ctx.clearRect(0, 0, width, height);

            // Logarithmic Scale Drawing
            const bufferLength = values.length;
            const minFreq = 20;
            const maxFreq = 22000;
            const contextSampleRate = Tone.getContext().sampleRate;
            const nyquist = contextSampleRate / 2;

            ctx.fillStyle = '#9C27B0';

            // Pixel-based approach ensures we fill the canvas
            for (let x = 0; x < width; x++) {
                // Map pixel x to Frequency (Log Scale)
                // x / width = (log(freq) - log(min)) / (log(max) - log(min))
                // log(freq) = (x / width) * (log(max) - log(min)) + log(min)
                const logMin = Math.log(minFreq);
                const logMax = Math.log(maxFreq);
                const logFreq = (x / width) * (logMax - logMin) + logMin;
                const freq = Math.exp(logFreq);

                // Map Frequency to Bin Index
                const index = Math.floor((freq / nyquist) * bufferLength);

                // Get value (clamped)
                const val = values[Math.min(index, bufferLength - 1)] as number;

                // Normalize DB value
                let norm = (val + 100) / 80;
                if (norm < 0) norm = 0;
                if (norm > 1) norm = 1;

                const barHeight = norm * height;

                // Draw 1px bar at x
                ctx.fillRect(x, height - barHeight, 1, barHeight);
            }

            requestRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            analyserRef.current?.dispose();
        };
    }, [width, height]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ backgroundColor: '#111', borderRadius: 4 }} />;
};

export default SpectrumAnalyzer;
