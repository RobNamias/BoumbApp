import React from 'react';
import { Drum, Music, Sliders, PlayCircle, Package } from 'lucide-react';
import styles from '../../../styles/modules/Sidebar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    toggleBrowser?: () => void;
    isBrowserOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleBrowser, isBrowserOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping helper to determine active state based on path
    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <aside className={styles.sidebar}>
            {/* Logo / Home -> Skyline (Song Mode) */}
            <button
                className={`${styles.navItem} ${isActive('/song') ? styles.active : ''}`}
                onClick={() => navigate('/song')}
                title="Song Mode (Timeline)"
                aria-label="Song Mode"
            >
                <PlayCircle size={24} />
            </button>

            <div className={styles.separator} />

            {/* Modules */}
            <button
                className={`${styles.navItem} ${isActive('/juicy') ? styles.active : ''}`}
                onClick={() => navigate('/juicy')}
                title="JuicyBox (Drums)"
                aria-label="JuicyBox Drums"
                style={isActive('/juicy') ? { backgroundColor: '#ff5722', boxShadow: '0 0 10px rgba(255, 87, 34, 0.4)' } : {}}
            >
                <Drum size={24} />
            </button>

            <button
                className={`${styles.navItem} ${isActive('/synth') ? styles.active : ''}`}
                onClick={() => navigate('/synth')}
                title="SynthLab (Melody)"
                aria-label="SynthLab Melody"
                style={isActive('/synth') ? { backgroundColor: '#4caf50', boxShadow: '0 0 10px rgba(76, 175, 80, 0.4)' } : {}}
            >
                <Music size={24} />
            </button>

            <button
                className={`${styles.navItem} ${isActive('/mixer') ? styles.active : ''}`}
                onClick={() => navigate('/mixer')}
                title="SauceMixer"
                aria-label="Mixer"
                style={isActive('/mixer') ? { backgroundColor: '#d32f2f', boxShadow: '0 0 10px rgba(211, 47, 47, 0.4)' } : {}}
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
