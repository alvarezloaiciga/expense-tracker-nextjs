export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface APIError {
  message: string;
  status?: number;
}

export interface CreditCard {
  id: number;
  name: string;
  last_four_digits: string;
  brand: string;
  limit: number;
  balance: number;
} 