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
