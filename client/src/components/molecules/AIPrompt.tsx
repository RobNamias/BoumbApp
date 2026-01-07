import React, { useState } from 'react';
import { aiService } from '../../services/AIService';
import { useProjectStore } from '../../store/projectStore';
import type { Note } from '../../store/projectStore';

interface AIPromptProps {
    onMelodyGenerated: (notes: Note[], requestId: string) => void;
    className?: string;
}

const AIPrompt: React.FC<AIPromptProps> = ({ onMelodyGenerated, className }) => {
    // Project Context
    const bpm = useProjectStore(state => state.project.meta.bpm);
    const globalKey = useProjectStore(state => state.project.meta.globalKey);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRequestId, setLastRequestId] = useState<string | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);

    const handleFeedback = async (rating: number) => {
        if (!lastRequestId) return;
        await aiService.sendFeedback(lastRequestId, rating);
        setFeedbackSent(true);
        // Optional: Clear after delay?
        setTimeout(() => {
            setFeedbackSent(false);
            setLastRequestId(null);
        }, 3000);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await aiService.generateMelody(
                prompt,
                bpm,
                globalKey
            );

            // Transform 'response.notes' (API format) to 'Note[]' (Store format)
            // The API returns { start, duration, pitch, velocity } but start/duration are in steps or float?
            // PromptFactory said: "start": 0 (steps), "duration": 4 (steps).
            // Our Store Note format: { time: string (0:0:0), note: string (C3), duration: string (16n), velocity: number }

            // We need a Converter here! 
            // Phase 3.1 didn't specify the conversion in the Frontend Service, so we do it here or in the Service.
            // Let's do a basic map for now, assuming the API returns what we asked (steps).

            // Temporary mapping until API returns strict TransportTime
            const mappedNotes: Note[] = response.notes.map((n: any) => ({
                time: `${Math.floor(n.start / 16)}:${Math.floor((n.start % 16) / 4)}:${n.start % 4}`,
                note: n.pitch,
                // Convert steps (16th notes) to Tone.js duration
                duration: (() => {
                    const steps = n.duration || 1;
                    switch (steps) {
                        case 1: return "16n";
                        case 2: return "8n";
                        case 4: return "4n";
                        case 8: return "2n";
                        case 16: return "1n";
                        default: return `${steps}*16n`; // Fallback for irregular durations (e.g. 3, 6)
                    }
                })(),
                velocity: n.velocity / 127 || 0.8
            }));

            console.log("AI Generation Response:", response);
            console.log("Setting RequestID:", response.request_id);

            onMelodyGenerated(mappedNotes, response.request_id);
            setLastRequestId(response.request_id);
            setFeedbackSent(false); // Reset for new generation
        } catch (err: any) {
            setError(err.message || "Failed to generate melody");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`ai-prompt ${className || ''}`}>
            <div className="ai-prompt__header">
                {/* Header title removed to avoid duplication with Modal title */}
                <div style={{ flex: 1 }}></div>
                <div className="ai-prompt__context">
                    <span className="badge">{bpm} BPM</span>
                    <span className="badge">{globalKey.root} {globalKey.scale}</span>
                </div>
            </div>

            <textarea
                className="ai-prompt__input"
                placeholder="Describe your melody (e.g., 'Funky bassline in minor pentatonic', 'Slow lush chords')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
            />


            <div className="ai-prompt__actions">
                <button
                    className={`btn-generate ${loading ? 'loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                >
                    {loading ? "Composing..." : "✨ Generate Melody"}
                </button>
            </div>

            {error && <div className="ai-prompt__error">{error}</div>}

            {lastRequestId && !loading && !feedbackSent && (
                <div className="ai-prompt__feedback">
                    <p className="feedback-label">How was it?</p>
                    <div className="feedback-rating">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                            <button
                                key={r}
                                className="btn-rating"
                                onClick={() => handleFeedback(r)}
                                title={`Rate ${r}/10`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {feedbackSent && (
                <div className="ai-prompt__feedback-sent">
                    <p>Thanks for your feedback! 🧠</p>
                </div>
            )}
        </div>
    );
};

// Inline Styles for Feedback-specific elements (Scoped)
// Ideally this moves to CSS, but ensures it works immediately.
const style = `
.ai-prompt__feedback { margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }
.feedback-label { color: #888; font-size: 0.8rem; margin-bottom: 0.5rem; text-align: center; }
.feedback-rating { display: flex; gap: 4px; justify-content: center; }
.btn-rating { 
    width: 28px; height: 28px; border-radius: 4px; border: 1px solid #444; 
    background: #222; color: #ccc; cursor: pointer; font-size: 0.75rem; 
    display: flex; align-items: center; justify-content: center; transition: all 0.2s; 
}
.btn-rating:hover { background: #646cff; color: white; border-color: #646cff; transform: scale(1.1); }
.ai-prompt__feedback-sent { margin-top: 1rem; text-align: center; color: #4caf50; font-size: 0.9rem; animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
`;

// Inject style (simple hack for this component)
if (typeof document !== 'undefined' && !document.getElementById('ai-feedback-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'ai-feedback-style';
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl);
}

export default AIPrompt;
