import { useState } from 'react';
import type { AuthState } from '../api/inventoryApi';
interface LoginFormProps {
    onLogin: (auth: AuthState) => void;
    onLogout: () => void;
    auth: AuthState;
}

/**
 * Login form component for Basic Auth authentication
 * Stores credentials in component state and passes them up to app.
 */
const LoginForm = ({ onLogin, onLogout, auth }: LoginFormProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        try {
            const isAdmin = username === 'admin';
            onLogin({ username, password, isLoggedIn: true, isAdmin });
            setError('');
        } catch {
            setError('Login failed. Please check your credentials.');
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
            <button onClick={handleLogin} className="btn btn-login">
                Login
            </button>
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default LoginForm;