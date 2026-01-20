import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import styles from '../../styles/modules/Hero.module.scss';

interface HeroProps {
    onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
    const { t, i18n } = useTranslation();
    const [exiting, setExiting] = useState(false);

    const handleStart = () => {
        setExiting(true);
        setTimeout(onStart, 800); // Wait for animation (matched with transition duration)
    };

    return (
        <div className={`${styles.heroContainer} ${exiting ? styles.exiting : ''}`}>
            {/* Language Switcher */}
            <button
                onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
                className={styles.languageBtn}
                title="Switch Language"
            >
                <Globe size={16} />
                <span>{i18n.language.toUpperCase()}</span>
            </button>

            <div className={styles.blobOrbit}>
                <div className={styles.blob} style={{
                    top: '20%', left: '20%', width: '40vw', height: '40vw',
                    background: '#4e0eff', animationDelay: '0s'
                }} />
                <div className={styles.blob} style={{
                    bottom: '20%', right: '20%', width: '35vw', height: '35vw',
                    background: '#bb86fc', animationDelay: '5s'
                }} />
                <div className={styles.blob} style={{
                    top: '60%', left: '60%', width: '25vw', height: '25vw',
                    background: '#ff0055', opacity: 0.2, animationDelay: '2s'
                }} />
            </div>

            <div className={styles.studioBg} />

            {/* Visualizer - 12 bars with staggered delays */}
            <div className={styles.audioVisualizer}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={styles.bar} style={{
                        animationDelay: `${Math.random() * 0.5}s`,
                        height: `${20 + Math.random() * 80}%`,
                        background: i % 2 === 0 ? '#646cff' : '#bb86fc'
                    }} />
                ))}
            </div>

            <div className={styles.contentContainer}>
                <h1 className={styles.titleGlow}>BOUMBAPP</h1>

                {/* Lite / Demo Disclaimer */}
                <div className={styles.disclaimer}>
                    <span>Demo Version • Front-End Only • Local Storage</span>
                </div>

                <p className={styles.subtitle}>
                    {t('hero.subtitle')}
                </p>

                <button className={styles.startBtn} onClick={handleStart}>
                    <span style={{ fontSize: '1.2rem' }}>▶</span>
                    {t('hero.enter')}
                </button>
            </div>

            <div className={styles.footer}>
                <span className={styles.footerFeature}>🎹 {t('hero.features.sequencer')}</span>
                <span className={styles.footerDivider}></span>
                <span className={styles.footerFeature}>🎛️ {t('hero.features.mixer')}</span>
                <span className={styles.footerDivider}></span>
                <span className={styles.footerFeature}>☁️ {t('hero.features.cloud')}</span>
            </div>
        </div>
    );
};

export default Hero;
