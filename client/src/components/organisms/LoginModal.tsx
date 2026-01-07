import React, { useState } from 'react';
import Modal from '../molecules/Modal';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import { useLoadingStore } from '../../store/loadingStore';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const login = useAuthStore((state) => state.login);

    // Helper to parse JWT
    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        useLoadingStore.getState().setLoading(true, isRegistering ? 'Inscription en cours...' : 'Connexion en cours...');

        try {
            let token = '';

            if (isRegistering) {
                // Register
                await authService.register(email, password, username);
                // Auto Login
                const resp = await authService.login(email, password);
                token = resp.token;
            } else {
                // Login
                const resp = await authService.login(email, password);
                token = resp.token;
            }

            // Decode Token to get real User Info
            const payload = parseJwt(token);
            if (payload) {
                login(token, {
                    id: payload.id || 0,
                    email: payload.username || email, // JWT 'username' is now correctly the email
                    username: payload.pseudo || payload.username || username || email.split('@')[0], // Use 'pseudo' claim for display
                    roles: payload.roles || ['ROLE_USER']
                });
            } else {
                // Fallback (Should not happen)
                login(token, { id: 0, email, username: email.split('@')[0], roles: ['ROLE_USER'] });
            }

            onClose();
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data['hydra:description']) setError(data['hydra:description']);
                else if (data.message) setError(data.message);
                else if (data.detail) setError(data.detail);
                else setError(t('auth.errors.generic'));
            } else {
                setError(t('auth.errors.credentials'));
            }
        } finally {
            useLoadingStore.getState().setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff 0%, #bb86fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-1px'
                }}>
                    {isRegistering ? t('auth.register_title') : t('auth.login_title')}
                </h2>
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>
                    {isRegistering ? t('auth.register_subtitle') : t('auth.login_subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {error && (
                    <div style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid #ff6b6b',
                        color: '#ff6b6b',
                        padding: '10px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {isRegistering && (
                    <div className="input-group">
                        <label style={labelStyle}>{t('auth.fields.username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            required={isRegistering}
                            placeholder={t('auth.fields.username_placeholder')}
                        />
                    </div>
                )}

                <div className="input-group">
                    <label style={labelStyle}>{t('auth.fields.email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                        placeholder={t('auth.fields.email_placeholder')}
                    />
                </div>

                <div className="input-group">
                    <label style={labelStyle}>{t('auth.fields.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                        placeholder={t('auth.fields.password_placeholder')}
                    />
                </div>

                <button
                    type="submit"
                    style={primaryBtnStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(187, 134, 252, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {isRegistering ? t('auth.submit.register') : t('auth.submit.login')}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '10px' }}>
                    <span style={{ color: '#666' }}>
                        {isRegistering ? t('auth.switch.has_account') + ' ' : t('auth.switch.no_account') + ' '}
                    </span>
                    <button
                        type="button"
                        onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                        style={linkBtnStyle}
                        onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#bb86fc'}
                    >
                        {isRegistering ? t('auth.switch.go_login') : t('auth.switch.go_register')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Styles
const labelStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'block',
    letterSpacing: '1px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#0a0a0a',
    color: '#e1e1e6',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
};

const primaryBtnStyle: React.CSSProperties = {
    padding: '14px',
    background: 'linear-gradient(90deg, #646cff 0%, #bb86fc 100%)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    letterSpacing: '1px',
    transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
    marginTop: '10px'
};

const linkBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#bb86fc', // Violet accent
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
    transition: 'color 0.2s'
};

export default LoginModal;
