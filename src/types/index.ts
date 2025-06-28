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