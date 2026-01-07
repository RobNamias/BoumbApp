import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

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
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'radial-gradient(circle at 50% 30%, #2a0033 0%, #09090a 80%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, color: '#e1e1e6', fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
            transition: 'all 0.8s cubic-bezier(0.6, 0, 0.2, 1)',
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'scale(1.2)' : 'scale(1)',
            filter: exiting ? 'blur(20px)' : 'none',
            pointerEvents: exiting ? 'none' : 'auto'
        }}>
            {/* Language Switcher */}
            <button
                onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
                style={{
                    position: 'absolute', top: '30px', right: '30px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '30px',
                    color: '#e1e1e6',
                    padding: '8px 16px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer',
                    zIndex: 100,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = '#bb86fc';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#bb86fc'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
            >
                <Globe size={16} />
                <span>{i18n.language.toUpperCase()}</span>
            </button>

            <style>
                {`
                    /* Floating Blobs Animation */
                    @keyframes float {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    @keyframes spin-slow {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    .blob-orbit {
                        position: absolute; top: 50%; left: 50%;
                        width: 150vmax; height: 150vmax;
                        animation: spin-slow 60s linear infinite;
                        pointer-events: none;
                        z-index: 0;
                    }
                    .blob {
                        position: absolute; filter: blur(80px); opacity: 0.4; animation: float 10s infinite ease-in-out;
                        border-radius: 50%;
                    }

                    /* Audio Bars Animation */
                    .audio-visualizer {
                        display: flex;
                        gap: 6px;
                        align-items: flex-end;
                        height: 60px;
                        margin-bottom: 20px;
                        opacity: 0.8;
                    }
                    .bar {
                        width: 8px;
                        background: linear-gradient(to top, #646cff, #bb86fc);
                        border-radius: 4px;
                        animation: bounce 1.2s infinite ease-in-out;
                    }
                    @keyframes bounce {
                        0%, 100% { height: 10%; opacity: 0.5; }
                        50% { height: 100%; opacity: 1; box-shadow: 0 0 15px #bb86fc; }
                    }

                    /* Floating Studio Elements */
                    .studio-bg {
                        position: absolute; width: 100%; height: 100%;
                        background-image: radial-gradient(rgba(100, 108, 255, 0.05) 1px, transparent 1px);
                        background-size: 30px 30px;
                        opacity: 0.3;
                        pointer-events: none;
                    }

                    /* Main Button */
                    .start-btn {
                        background: transparent;
                        border: 1px solid rgba(187, 134, 252, 0.3);
                        color: #e1e1e6;
                        padding: 16px 48px;
                        font-family: system-ui;
                        font-size: 1.1rem;
                        font-weight: 600;
                        letter-spacing: 1px;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(10px);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        position: relative;
                        overflow: hidden;
                    }
                    .start-btn:hover {
                        border-color: #bb86fc;
                        background: rgba(187, 134, 252, 0.1);
                        box-shadow: 0 0 30px rgba(187, 134, 252, 0.2);
                        transform: translateY(-2px);
                        color: #fff;
                    }
                    .start-btn::before {
                        content: '';
                        position: absolute;
                        top: 0; left: -100%; width: 100%; height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                        transition: 0.5s;
                    }
                    .start-btn:hover::before {
                        left: 100%;
                    }

                    /* Typography */
                    .title-glow {
                        font-size: 5rem;
                        font-weight: 800;
                        letter-spacing: -2px;
                        background: linear-gradient(180deg, #fff 0%, #a0a0a0 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        filter: drop-shadow(0 0 20px rgba(187, 134, 252, 0.3));
                    }
                `}
            </style>

            <div className="blob-orbit">
                <div className="blob" style={{
                    top: '20%', left: '20%', width: '40vw', height: '40vw',
                    background: '#4e0eff', animationDelay: '0s'
                }} />
                <div className="blob" style={{
                    bottom: '20%', right: '20%', width: '35vw', height: '35vw',
                    background: '#bb86fc', animationDelay: '5s'
                }} />
                <div className="blob" style={{
                    top: '60%', left: '60%', width: '25vw', height: '25vw',
                    background: '#ff0055', opacity: 0.2, animationDelay: '2s'
                }} />
            </div>

            <div className="studio-bg" style={{ zIndex: 1 }} />

            {/* Visualizer - 12 bars with staggered delays */}
            <div className="audio-visualizer" style={{ zIndex: 2 }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bar" style={{
                        animationDelay: `${Math.random() * 0.5}s`,
                        height: `${20 + Math.random() * 80}%`,
                        background: i % 2 === 0 ? '#646cff' : '#bb86fc'
                    }} />
                ))}
            </div>

            <div style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="title-glow" style={{ margin: 0 }}>BOUMBAPP</h1>

                <p style={{
                    fontSize: '1.1rem', color: '#9ca3af', margin: '10px 0 50px 0',
                    letterSpacing: '0.5px', fontWeight: 300
                }}>
                    {t('hero.subtitle')}
                </p>

                <button className="start-btn" onClick={handleStart}>
                    <span style={{ fontSize: '1.2rem' }}>▶</span>
                    {t('hero.enter')}
                </button>
            </div>

            <div style={{
                position: 'absolute', bottom: '30px',
                display: 'flex', gap: '30px', color: '#666', fontSize: '0.85rem', zIndex: 10
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🎹 {t('hero.features.sequencer')}</span>
                <span style={{ width: '1px', background: '#333' }}></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🎛️ {t('hero.features.mixer')}</span>
                <span style={{ width: '1px', background: '#333' }}></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>☁️ {t('hero.features.cloud')}</span>
            </div>
        </div>
    );
};

export default Hero;
