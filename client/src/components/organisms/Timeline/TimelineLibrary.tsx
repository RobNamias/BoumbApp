import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../styles/modules/Timeline.module.scss';
import { useProjectStore } from '../../../store/projectStore';

interface TimelineLibraryProps {
    groups: any[];
    onDragStart: (e: React.DragEvent, patternId: string, type: string) => void;
}

const TimelineLibrary: React.FC<TimelineLibraryProps> = ({ groups, onDragStart }) => {
    const { t } = useTranslation();
    const [expandedGroupIds, setExpandedGroupIds] = useState<Record<string, boolean>>({
        'group-juicy': true,
        'group-synth': true
    });
    const { project } = useProjectStore();

    const toggleGroup = (groupId: string) => {
        setExpandedGroupIds(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const getPatternsByType = (type: string) => {
        return type === 'drums'
            ? Object.values(project.drumPatterns)
            : Object.values(project.melodicPatterns);
    };

    return (
        <div className={styles.libraryColumn}>
            <div className={styles.libraryHeader}>{t('timeline.library')}</div>
            {groups.map(group => {
                const isExpanded = expandedGroupIds[group.id];
                const availablePatterns = getPatternsByType(group.type);

                return (
                    <div key={group.id} className={styles.libraryGroup}>
                        <div
                            className={styles.groupHeader}
                            onClick={() => toggleGroup(group.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <span className={styles.groupName}>{group.name}</span>
                            <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                        </div>

                        {isExpanded && (
                            <div className={styles.libraryDrawer}>
                                {availablePatterns.length === 0 ? (
                                    <div className={styles.emptyMsg}>No patterns</div>
                                ) : (
                                    availablePatterns.map(pat => (
                                        <div
                                            key={pat.id}
                                            className={`${styles.libraryItem} ${group.type === 'drums' ? styles.drums : styles.melody}`}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, pat.id, group.type)}
                                        >
                                            <span className={styles.patName}>{pat.name}</span>
                                            <span className={styles.dragHandle}>:::</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TimelineLibrary;
