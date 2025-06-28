import axios from 'axios';
import type { AuthResponse, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', data.token);
  }
  return data;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/signup', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', data.token);
  }
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/api/me');
  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
}

export default {
  login,
  signup,
  getCurrentUser,
  logout,
}; 