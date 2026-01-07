


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
    generateMelody: async (
        prompt: string,
        currentBpm: number,
        globalKey: { root: string, scale: string },
        options?: GenerationOptions
    ): Promise<GenerateResponse> => {

        try {
            const payload = {
                prompt,
                bpm: currentBpm,
                global_key: globalKey, // Pass project context
                duration: options?.duration || 32, // Default to 32 if not specified
                options: options || null
            };

            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'AI Generation Failed');
            }

            return await response.json();

        } catch (error) {
            console.error("AI Service Error:", error);
            throw error;
        }
    },

    /**
     * Send User Feedback
     */
    sendFeedback: async (requestId: string, rating: number, comment: string = "") => {
        try {
            await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestId, rating, comment })
            });
        } catch (e) {
            console.warn("Failed to send feedback", e);
        }
    }
};
