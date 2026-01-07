import React from 'react';
import { Drum, Music, Sliders, Hexagon, PlayCircle, Package } from 'lucide-react';
import styles from '../../../styles/modules/Sidebar.module.scss';

interface SidebarProps {
    currentView: 'skyline' | 'studio' | 'synthlab' | 'mixer' | 'settings';
    onViewChange: (view: 'skyline' | 'studio' | 'synthlab' | 'mixer' | 'settings') => void;
    toggleBrowser?: () => void;
    isBrowserOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, toggleBrowser, isBrowserOpen }) => {

    return (
        <aside className={styles.sidebar}>
            {/* Logo / Home -> Skyline (Song Mode) */}
            <button
                className={`${styles.navItem} ${currentView === 'skyline' ? styles.active : ''}`}
                onClick={() => onViewChange('skyline')}
                title="Song Mode (Timeline)"
                aria-label="Song Mode"
            >
                <PlayCircle size={24} />
            </button>

            <div className={styles.separator} />

            {/* Modules */}
            <button
                className={`${styles.navItem} ${currentView === 'studio' ? styles.active : ''}`}
                onClick={() => onViewChange('studio')}
                title="JuicyBox (Drums)"
                aria-label="JuicyBox Drums"
                style={currentView === 'studio' ? { backgroundColor: '#ff5722', boxShadow: '0 0 10px rgba(255, 87, 34, 0.4)' } : {}}
            >
                <Drum size={24} />
            </button>

            <button
                className={`${styles.navItem} ${currentView === 'synthlab' ? styles.active : ''}`}
                onClick={() => onViewChange('synthlab')}
                title="SynthLab (Melody)"
                aria-label="SynthLab Melody"
                style={currentView === 'synthlab' ? { backgroundColor: '#4caf50', boxShadow: '0 0 10px rgba(76, 175, 80, 0.4)' } : {}}
            >
                <Music size={24} />
            </button>

            <button
                className={`${styles.navItem} ${currentView === 'mixer' ? styles.active : ''}`}
                onClick={() => onViewChange('mixer')}
                title="SauceMixer"
                aria-label="Mixer"
                style={currentView === 'mixer' ? { backgroundColor: '#d32f2f', boxShadow: '0 0 10px rgba(211, 47, 47, 0.4)' } : {}}
            >
                <Sliders size={24} />
            </button>

            <div className={styles.separator} />

            {/* Toggle Browser (Toolkit) */}
            <button
                className={`${styles.navItem} ${isBrowserOpen ? styles.active : ''}`}
                onClick={toggleBrowser}
                title="Toggle Library"
                aria-label="Library"
            >
                <Package size={24} />
            </button>

            <div style={{ flex: 1 }} />

            <div className={styles.footer} />
        </aside>
    );
};

export default Sidebar;
