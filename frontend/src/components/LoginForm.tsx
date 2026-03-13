import { useState } from 'react';
import type { AuthState } from '../api/inventoryApi';
import axios from 'axios';

interface LoginFormProps {
    onLogin: (auth: AuthState) => void;
    onLogout: () => void;
    auth: AuthState;
}

/**
 * Login form component for Basic Auth authentication, verifies credentials against the backend before accepting the login.
 */
const LoginForm = ({ onLogin, onLogout, auth }: LoginFormProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            // Verify credentials against the backend before accepting login
            await axios.get('http://localhost:8080/api/items', {
                headers: {
                    Authorization: 'Basic ' + btoa(username + ':' + password),
                },
            });
            const isAdmin = username === 'admin';
            onLogin({ username, password, isLoggedIn: true, isAdmin });
        } catch {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (auth.isLoggedIn) {
        return (
            <div className="login-bar">
                <span>
                    Logged in as <strong>{auth.username}</strong>
                    {auth.isAdmin && <span className="admin-badge">ADMIN</span>}
                </span>
                <button onClick={onLogout} className="btn btn-logout">
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="login-bar">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin} disabled={loading} className="btn btn-login">
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default LoginForm;