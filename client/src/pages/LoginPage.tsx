import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import AudioEngine from '../audio/AudioEngine';

const LoginPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    // ... handles login or register
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegistering) {
                // 1. Register
                await authService.register(email, password, username);
                // 2. Auto Login (using the credentials just created)
                const { token } = await authService.login(email, password);
                await AudioEngine.initialize();
                login(token, { id: 0, email, username, roles: ['ROLE_USER'] }); // ID is mock until /me implemented
                navigate('/');
            } else {
                // Login
                const { token } = await authService.login(email, password);
                await AudioEngine.initialize();
                login(token, { id: 1, email, username: email.split('@')[0], roles: ['ROLE_USER'] });
                navigate('/');
            }
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                // API Platform / Symfony Validation Errors
                const data = err.response.data;
                if (data['hydra:description']) {
                    setError(data['hydra:description']);
                } else if (data.message) {
                    setError(data.message);
                } else if (data.detail) {
                    setError(data.detail);
                } else {
                    console.error('Unknown Registration Error:', data);
                    setError('An unknown error occurred. Please check console.');
                }
            } else {
                setError(isRegistering ? 'Registration failed (Network or Server Error)' : 'Invalid credentials');
            }
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#111', color: '#eee',
        }}>
            <form onSubmit={handleSubmit} style={{
                display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem',
                backgroundColor: '#222', borderRadius: '8px', width: '300px', border: '1px solid #333'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {isRegistering ? 'Create Account' : 'BOUMBAPP Login'}
                </h2>

                {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</div>}

                {/* Username (Register only) */}
                {isRegistering && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                            required={isRegistering}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                        required
                    />
                </div>

                <button type="submit" style={{
                    padding: '0.75rem', marginTop: '1rem', backgroundColor: '#646cff',
                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                }}>
                    {isRegistering ? 'Register & Start' : 'Login & Start Audio'}
                </button>

                <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: '#aaa' }}>
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    </span>
                    <button
                        type="button"
                        onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                        style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isRegistering ? 'Login here' : 'Register here'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
