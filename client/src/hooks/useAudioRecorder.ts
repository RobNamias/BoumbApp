import { useState, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import audioInstance from '../audio/AudioEngine';
import { ExportManager } from '../services/ExportManager';

export const useAudioRecorder = (onRecordingComplete?: (blob: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = useRef<Tone.Recorder | null>(null);

    const startRecording = useCallback(async () => {
        if (Date.now() - (globalThis as any)._lastRecClick < 500) return; // Debounce
        (globalThis as any)._lastRecClick = Date.now();

        console.log("[useAudioRecorder] Starting Recording...");

        // 1. Ensure Audio Context is Release
        await Tone.start();

        // 2. Create Recorder if needed
        if (!recorderRef.current) {
            recorderRef.current = new Tone.Recorder();
            // Connect Master Mix -> Recorder
            // We tap into the Master Strip's Output (MuteGain)
            audioInstance.masterStrip.muteGain.connect(recorderRef.current);
        }

        // 3. Start
        recorderRef.current.start();
        setIsRecording(true);
    }, []);

    const stopRecording = useCallback(async () => {
        if (!recorderRef.current || !isRecording) return;
        console.log("[useAudioRecorder] Stopping Recording...");

        // 1. Stop and Get Blob
        const blob = await recorderRef.current.stop();
        setIsRecording(false);

        // 2. Handoff Logic
        if (onRecordingComplete) {
            onRecordingComplete(blob);
        } else {
            // Fallback (or deprecate)
            await ExportManager.saveLiveRecording(blob, 'Live Recording');
        }

        // Cleanup
        // We generally keep the recorder instance alive, but we could dispose it if we wanted to save memory
        // recorderRef.current.dispose();
        // recorderRef.current = null;
    }, [isRecording, onRecordingComplete]);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    return {
        isRecording,
        startRecording,
        stopRecording,
        toggleRecording
    };
};
