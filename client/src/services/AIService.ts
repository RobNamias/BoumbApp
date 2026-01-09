


// Access Environment Variable (Vite)
// In development with Docker, we might need to target localhost:8002 directly
// or use a proxy. For now, we hardcode the mapped port or use VITE_API_URL.
const API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8002/api/v1';

export interface GenerationOptions {
    root?: string;
    scale_type?: string;
    bpm?: number;
    octave_range?: [number, number];
    duration?: number;
}

export interface GenerateResponse {
    request_id: string;
    notes: any[]; // Raw JSON from API
    analysis: {
        root: string;
        scale_type: string;
        bpm: number;
    };
}

export const aiService = {
    /**
     * Call AI to generate a melody
     */
    /**
     * Call AI to generate a melody
     */
    generateMelody: async (
        prompt: string,
        currentBpm: number,
        globalKey: { root: string, scale: string },
        options?: GenerationOptions
    ): Promise<GenerateResponse> => {

        // Mock implementation for Lite Mode
        await new Promise((r) => setTimeout(r, 600));

        return {
            request_id: "mock-id-" + Date.now(),
            analysis: {
                root: globalKey.root,
                scale_type: globalKey.scale,
                bpm: currentBpm
            },
            notes: [
                { time: 0, midi: 60, duration: 0.25, velocity: 0.9 },
                { time: 0.25, midi: 62, duration: 0.25, velocity: 0.9 },
                { time: 0.5, midi: 64, duration: 0.25, velocity: 0.9 },
                { time: 0.75, midi: 65, duration: 0.25, velocity: 0.9 },
                { time: 1.0, midi: 67, duration: 0.5, velocity: 0.9 },
            ]
        };
    },

    /**
     * Send User Feedback
     */
    sendFeedback: async (requestId: string, rating: number, comment: string = "") => {
        try {
            // [LITE] Disabled for static version
            // await fetch(`${API_URL}/feedback`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ request_id: requestId, rating, comment })
            // });
            console.log("[LITE] Feedback logged:", { requestId, rating, comment });
        } catch (e) {
            console.warn("Failed to send feedback", e);
        }
    }
};
