import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/modules/GlobalKeySelector.module.scss';

interface GlobalKeySelectorProps {
    root: string;
    scale: string;
    onChange: (root: string, scale: string) => void;
}

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALES = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'];

const GlobalKeySelector: React.FC<GlobalKeySelectorProps> = ({ root, scale, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleRootChange = (newRoot: string) => {
        onChange(newRoot, scale);
    };

    const handleScaleChange = (newScale: string) => {
        onChange(root, newScale);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                role="button"
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                title="Global Key"
            >
                <span className={styles.label}>KEY</span>
                <span className={styles.value}>{root} {scale}</span>
            </div>

            {isOpen && (
                <div className={styles.popover}>
                    <div className={styles.column}>
                        <h5>Root</h5>
                        <div className={styles.grid}>
                            {ROOTS.map(r => (
                                <button
                                    key={r}
                                    className={`${styles.optionBtn} ${root === r ? styles.selected : ''}`}
                                    onClick={() => handleRootChange(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.column}>
                        <h5>Scale</h5>
                        <div className={styles.scaleList}>
                            {SCALES.map(s => (
                                <button
                                    key={s}
                                    className={`${styles.optionBtn} ${scale === s ? styles.selected : ''}`}
                                    onClick={() => handleScaleChange(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalKeySelector;
