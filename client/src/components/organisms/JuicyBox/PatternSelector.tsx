import React from 'react';
import styles from '../../../styles/modules/PatternSelector.module.scss'; // Assuming we create SCSS or use inline for now

interface PatternSelectorProps {
    patterns: { id: string, name: string }[];
    activePatternId: string | null;
    onSelectPattern: (id: string | null) => void;
    onCreatePattern: () => void;
    color: 'blue' | 'green' | 'orange' | 'purple';
}

const COLOR_MAP: Record<string, { border: string, bg: string }> = {
    blue: { border: '#2196F3', bg: '#2196F333' },
    green: { border: '#4CAF50', bg: '#4CAF5033' },
    orange: { border: '#FF9800', bg: '#FF980033' },
    purple: { border: '#E91E63', bg: '#E91E6333' },
};

const PatternSelector: React.FC<PatternSelectorProps> = ({
    patterns,
    activePatternId,
    onSelectPattern,
    onCreatePattern,
    color
}) => {
    // Fixed 8 slots A-H
    const slots = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const scheme = COLOR_MAP[color] || COLOR_MAP.blue;

    return (
        <div className={`${styles.patternSelector} ${styles[color]}`}>
            <div className={styles.patternList}>
                {slots.map((label, index) => {
                    const pattern = patterns[index];
                    const exists = !!pattern;
                    const isNext = !exists && index === patterns.length;

                    // We only allow clicking if it exists OR it's the immediate next available slot
                    // (Enforce sequential creation for now to match Store behavior)
                    const canProcced = exists || isNext;

                    return (
                        <button
                            key={label}
                            className={`${styles.patternBtn} ${activePatternId === pattern?.id ? styles.active : ''}`}
                            onClick={() => {
                                if (exists) {
                                    onSelectPattern(pattern.id);
                                } else if (isNext) {
                                    onCreatePattern();
                                }
                            }}
                            disabled={!canProcced}
                            style={{
                                borderColor: exists ? scheme.border : (isNext ? '#444' : '#222'),
                                backgroundColor: activePatternId === pattern?.id ? scheme.bg : 'transparent',
                                color: activePatternId === pattern?.id ? '#fff' : (exists ? '#aaa' : '#444'),
                                cursor: canProcced ? 'pointer' : 'default',
                                borderStyle: exists ? 'solid' : 'dashed'
                            }}
                            title={exists ? pattern.name : (isNext ? "Create Pattern" : "Locked")}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
            {/* Removed explicit Add Button */}
        </div>
    );
};

export default PatternSelector;
