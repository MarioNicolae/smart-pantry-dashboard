import axios from 'axios';

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  minThreshold: number;
  isLowStock: boolean;
}

export interface CreateItemRequest {
  name: string;
  quantity: number;
  minThreshold: number;
}

export interface RestockRequest {
  quantity: number;
}

export interface AuthState {
  username: string;
  password: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

const authHeader = (u: string, p: string) => ({ Authorization: 'Basic ' + btoa(u + ':' + p) });

export const getAllItems = async () => (await api.get('/api/items')).data;

export const createItem = async (r, u, p) =>
  (await api.post('/api/items', r, { headers: authHeader(u, p) })).data;

export const restockItem = async (id, r, u, p) =>
  (await api.patch('/api/items/' + id + '/restock', r, { headers: authHeader(u, p) })).data;

export const deleteItem = async (id, u, p) => {
  await api.delete('/api/items/' + id, { headers: authHeader(u, p) });
};
