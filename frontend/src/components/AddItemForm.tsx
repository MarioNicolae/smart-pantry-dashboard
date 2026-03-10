import { useState } from 'react';
import type { CreateItemRequest, InventoryItem, AuthState } from '../api/inventoryApi';
import { createItem } from '../api/inventoryApi';

interface AddItemFormProps {
    auth: AuthState;
    onItemAdded: (item: InventoryItem) => void;
}

/**
 * Form component for adding new inventory items. Only visible to ADMIN users.
 */
const AddItemForm = ({ auth, onItemAdded }: AddItemFormProps) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [minThreshold, setMinThreshold] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !quantity || !minThreshold) {
            setError('All fields are required.');
            return;
        }

        const request: CreateItemRequest = {
            name,
            quantity: parseInt(quantity),
            minThreshold: parseInt(minThreshold),
        };

        try {
            setLoading(true);
            setError('');
            const newItem = await createItem(request, auth.username, auth.password);
            onItemAdded(newItem);
            setName('');
            setQuantity('');
            setMinThreshold('');
            setSuccess(`"${newItem.name}" added successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Failed to add item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-item-form">
            <h3>Add New Item</h3>
            <div className="form-row">
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input input-small"
                />
                <input
                    type="number"
                    placeholder="Min Threshold"
                    min={0}
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(e.target.value)}
                    className="input input-small"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-add"
                >
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
            </div>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
        </div>
    );
};

export default AddItemForm;