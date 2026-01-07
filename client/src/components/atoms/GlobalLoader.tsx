import React from 'react';
import { useLoadingStore } from '../../store/loadingStore';
import { Loader2 } from 'lucide-react';

const GlobalLoader: React.FC = () => {
    const { isLoading, message } = useLoadingStore();

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999, // Always on top
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                background: '#1e1e1e',
                padding: '32px 48px',
                borderRadius: '12px',
                border: '1px solid #333',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <Loader2 size={48} className="animate-spin" color="#bb86fc" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                    {message || 'Loading...'}
                </span>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GlobalLoader;
