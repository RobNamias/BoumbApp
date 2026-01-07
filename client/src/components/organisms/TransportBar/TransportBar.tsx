import React, { useState } from 'react';
import styles from '../../../styles/modules/TransportBar.module.scss';
import { Play, Pause, Square, Rewind } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';
// Note: We will connect to AudioEngine later. For now, UI state.

const TransportBar: React.FC = () => {
    // Local state for UI feedback or connect to store if store has isPlaying
    // ProjectStore doesn't handle isPlaying yet (Gap identified previously: TransportSlice)
    // For now we just mock the buttons
    const [isPlaying, setIsPlaying] = useState(false);
    const { project } = useProjectStore();

    return (
        <header className={styles.transport}>
            <div className={styles.projectInfo}>
                <span className={styles.title}>{project.meta.title}</span>
                <span className={styles.bpm}>{project.meta.bpm} BPM</span>
            </div>

            <div className={styles.controls}>
                <button className={styles.btn} onClick={() => console.log('Rewind')}>
                    <Rewind size={20} />
                </button>

                <button
                    className={`${styles.btn} ${styles.playBtn} ${isPlaying ? styles.active : ''}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <button className={styles.btn} onClick={() => setIsPlaying(false)}>
                    <Square size={20} fill="currentColor" />
                </button>
            </div>

            <div className={styles.timeDisplay}>
                0:0:0
            </div>

            <div className={styles.userSection}>
                <div className={styles.avatar}>U</div>
            </div>
        </header>
    );
};

export default TransportBar;
