import type { ProjectData } from '../store/projectStore';
import { OfflineAudioRenderer } from '../audio/OfflineAudioRenderer';

export class ExportManager {
    /**
     * Trigger Offline Export with Prompt for Filename
     */
    /**
     * Trigger Offline Export
     */
    static async exportOfflineProject(project: ProjectData, filenameArg?: string) {
        // 1. Resolve Filename
        const filename = filenameArg || project.meta.title || 'My Song';

        try {
            // 2. Render
            const blob = await OfflineAudioRenderer.renderProject(project);

            // 3. Download
            this.downloadBlob(blob, `${filename}.wav`);
        } catch (e) {
            console.error("Export Failed", e);
            throw e; // Let caller handle error UI
        }
    }

    /**
     * Handle Live Recording Download
     */
    static saveLiveRecording(blob: Blob, filenameArg: string = 'Live Recording') {
        const filename = filenameArg;

        // Current blob is likely WebM (from Tone.Recorder default in most browsers)
        // We can force WAV if we want, but decoding/encoding in browser is heavy.
        // For "Pure Wave" request, ideally we'd decode WebM and re-encode to WAV,
        // OR we accept WebM for Live and WAV for Offline.
        //
        // Let's stick to the Blob's native type but allow naming.
        // If users REALLY want WAV Live, we need a custom RecorderNode (AudioWorklet).
        // Tone.Recorder DOES support mimeType 'audio/wav' IF the browser supports it.
        // Chrome/Edge/Firefox support 'audio/webm' natively. 'audio/wav' is rare in MediaRecorder.

        const finalBlob = blob;
        let extension = 'webm';

        if (blob.type.includes('wav')) extension = 'wav';
        else if (blob.type.includes('mp4')) extension = 'mp4';

        this.downloadBlob(finalBlob, `${filename}.${extension}`);
    }

    static downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
        URL.revokeObjectURL(url);
    }
}
