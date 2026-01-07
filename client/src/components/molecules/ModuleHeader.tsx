import React from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from '../../styles/modules/ModuleHeader.module.scss';

interface ModuleHeaderProps {
    title: string;
    icon: LucideIcon;
    color: string;
    children?: React.ReactNode;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({ title, icon: Icon, color, children }) => {
    return (
        <div
            className={styles.moduleHeader}
            style={{ borderBottomColor: `${color}4D` }} // 30% opacity hex
        >
            <div className={styles.leftSection}>
                <h2 style={{ color: color }}>
                    <Icon size={24} style={{ color: color }} />
                    <span style={{ marginLeft: '10px' }}>{title}</span>
                </h2>
            </div>

            <div className={styles.rightSection}>
                {children}
            </div>
        </div>
    );
};

export default ModuleHeader;
