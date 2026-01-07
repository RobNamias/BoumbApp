import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../styles/modules/AIComposerPopover.module.scss';
import { aiService } from '../../../services/AIService';
import { useProjectStore } from '../../../store/projectStore';
import type { Note } from '../../../store/projectStore';
import { X, Sparkles, Wand2 } from 'lucide-react';

interface AIComposerPopoverProps {
    onClose: () => void;
    onGenerated: (notes: Note[], requestId: string) => void;
}

const AIComposerPopover: React.FC<AIComposerPopoverProps> = ({ onClose, onGenerated }) => {
    const { t } = useTranslation();
    // Context
    const bpm = useProjectStore(state => state.project.meta.bpm);
    const globalKey = useProjectStore(state => state.project.meta.globalKey);

    // State
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Feedback State
    const [lastRequestId, setLastRequestId] = useState<string | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Click Outside Handling REMOVED to allow interaction with Transport/PianoRoll
    const popoverRef = useRef<HTMLDivElement>(null);

    // Position Calculation (Simple for now, bottom-left of trigger)
    const style: React.CSSProperties = {};

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await aiService.generateMelody(prompt, bpm, globalKey);

            // Map Logic (Copied from AIPrompt - Should be centralized later)
            const mappedNotes: Note[] = response.notes.map((n: any) => ({
                time: `${Math.floor(n.start / 16)}:${Math.floor((n.start % 16) / 4)}:${n.start % 4}`,
                note: n.pitch,
                duration: (() => {
                    const steps = n.duration || 1;
                    switch (steps) {
                        case 1: return "16n";
                        case 2: return "8n";
                        case 4: return "4n";
                        case 8: return "2n";
                        case 16: return "1n";
                        default: return `${steps}*16n`;
                    }
                })(),
                velocity: n.velocity / 127 || 0.8
            }));

            onGenerated(mappedNotes, response.request_id);
            setLastRequestId(response.request_id);
            setShowFeedback(true); // Switch to feedback mode

        } catch (err: any) {
            setError(err.message || "Generation Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = async (rating: number) => {
        if (!lastRequestId) return;
        await aiService.sendFeedback(lastRequestId, rating);
        setFeedbackSent(true);
        setTimeout(() => onClose(), 1500); // Close after thanks
    };

    return (
        <div className={styles.popoverContainer} ref={popoverRef} style={style}>
            <div className={styles.header}>
                <h4>
                    <Sparkles size={14} style={{ marginRight: 6, display: 'inline' }} />
                    {t('ai_composer.title')}
                </h4>
                <button onClick={onClose} className={styles.closeBtn}><X size={16} /></button>
            </div>

            {showFeedback ? (
                // --- STEP 2: FEEDBACK ---
                <div className={styles.stepFeedback}>
                    <p className={styles.successMsg}>{t('ai_composer.generated')}</p>
                    <p className={styles.subtext}>{t('ai_composer.audition')}</p>

                    {feedbackSent ? (
                        <div className={styles.thanks}>
                            {t('ai_composer.thanks')}
                        </div>
                    ) : (
                        <>
                            <p className={styles.ratingLabel}>{t('ai_composer.rating_label')}</p>
                            <div className={styles.ratingGrid}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => handleFeedback(r)}
                                        className={styles.ratingBtn}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className={styles.actions}>
                        <button onClick={() => setShowFeedback(false)} className={styles.retryBtn}>
                            {t('ai_composer.retry')}
                        </button>
                    </div>
                </div>
            ) : (
                // --- STEP 1: PROMPT ---
                <div className={styles.stepPrompt}>
                    <div className={styles.contextInfo}>
                        {/* Use globalKey directly from store if available, or fallback */}
                        <span>{bpm} BPM</span>
                        <span>{globalKey ? `${globalKey.root} ${globalKey.scale}` : "C Minor"}</span>
                    </div>

                    <textarea
                        className={styles.input}
                        placeholder={t('ai_composer.placeholder')}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? <Wand2 className={styles.spin} size={16} /> : t('ai_composer.generate')}
                    </button>
                </div>
            )}

        </div >
    );
};

export default AIComposerPopover;
