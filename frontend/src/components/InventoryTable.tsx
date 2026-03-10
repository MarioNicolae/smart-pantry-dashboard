import { useState } from 'react';
import type { InventoryItem, AuthState } from '../api/inventoryApi';
import { restockItem, deleteItem } from '../api/inventoryApi';

interface InventoryTableProps {
    items: InventoryItem[];
    auth: AuthState;
    onItemsChange: (items: InventoryItem[]) => void;
}

/**
 * Displays all inventory items in a table. Low stock items are visually highlighted. Admin users can restock or delete items inline
 */
const InventoryTable = ({ items, auth, onItemsChange }: InventoryTableProps) => {
    const [restockAmounts, setRestockAmounts] = useState<Record<number, number>>({});
    const [error, setError] = useState('');

    const handleRestock = async (id: number) => {
        const amount = restockAmounts[id];
        if (!amount || amount <= 0) {
            setError('Please enter a valid restock quantity.');
            return;
        }
        try {
            const updated = await restockItem(
                id,
                { quantity: amount },
                auth.username,
                auth.password
            );
            onItemsChange(items.map((item) => (item.id === updated.id ? updated : item)));
            setRestockAmounts((prev) => ({ ...prev, [id]: 0 }));
            setError('');
        } catch {
            setError('Restock failed. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteItem(id, auth.username, auth.password);
            onItemsChange(items.filter((item) => item.id !== id));
            setError('');
        } catch {
            setError('Delete failed. Please try again.');
        }
    };

    if (items.length === 0) {
        return <p className="empty-state">No items in the pantry yet.</p>;
    }

    return (
        <div className="table-wrapper">
            {error && <p className="error-text">{error}</p>}
            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Min Threshold</th>
                    <th>Status</th>
                    {auth.isAdmin && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.id} className={item.isLowStock ? 'row-low-stock' : ''}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.minThreshold}</td>
                        <td>
                            {item.isLowStock ? (
                                <span className="badge badge-low">⚠ Low Stock</span>
                            ) : (
                                <span className="badge badge-ok">✓ OK</span>
                            )}
                        </td>
                        {auth.isAdmin && (
                            <td className="actions-cell">
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Qty"
                                    value={restockAmounts[item.id] || ''}
                                    onChange={(e) =>
                                        setRestockAmounts((prev) => ({
                                            ...prev,
                                            [item.id]: parseInt(e.target.value),
                                        }))
                                    }
                                    className="input input-small"
                                />
                                <button
                                    onClick={() => handleRestock(item.id)}
                                    className="btn btn-restock"
                                >
                                    Restock
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="btn btn-delete"
                                >
                                    Delete
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;