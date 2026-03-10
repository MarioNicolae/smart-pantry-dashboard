import { useState, useEffect } from 'react';
import type { InventoryItem, AuthState } from './api/inventoryApi';
import { getAllItems } from './api/inventoryApi';
import LoginForm from './components/LoginForm';
import InventoryTable from './components/InventoryTable';
import AddItemForm from './components/AddItemForm';
import './App.css';

/**
 * Root component for the Smart Pantry Dashboard. Manages global auth state and inventory data.
 */
const App = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [auth, setAuth] = useState<AuthState>({
        username: '',
        password: '',
        isLoggedIn: false,
        isAdmin: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllItems();
            setItems(data);
        } catch {
            setError('Failed to load inventory. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleLogin = (newAuth: AuthState) => {
        setAuth(newAuth);
    };

    const handleLogout = () => {
        setAuth({
            username: '',
            password: '',
            isLoggedIn: false,
            isAdmin: false,
        });
    };

    const handleItemAdded = (newItem: InventoryItem) => {
        setItems((prev) => [...prev, newItem]);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">🥫</span>
                        <h1>Smart Pantry Dashboard</h1>
                    </div>
                    <LoginForm auth={auth} onLogin={handleLogin} onLogout={handleLogout} />
                </div>
            </header>

            <main className="app-main">
                {auth.isAdmin && (
                    <AddItemForm auth={auth} onItemAdded={handleItemAdded} />
                )}

                <section className="inventory-section">
                    <div className="section-header">
                        <h2>Inventory</h2>
                        <button onClick={fetchItems} className="btn btn-refresh">
                            ↻ Refresh
                        </button>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner" />
                            <p>Loading inventory...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <p className="error-text error-center">{error}</p>
                    )}

                    {!loading && !error && (
                        <InventoryTable
                            items={items}
                            auth={auth}
                            onItemsChange={setItems}
                        />
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;