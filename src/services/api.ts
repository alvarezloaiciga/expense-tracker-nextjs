import axios from 'axios';
import type { AuthResponse, User, CreditCard } from '@/types';

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

// Helper function to set token in both localStorage and cookies
const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-token', token);
    // Set cookie with 7 days expiry - ensure it's accessible to middleware
    document.cookie = `auth-token=${token}; max-age=${7 * 24 * 60 * 60}; path=/;`;
  }
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/login', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/signup', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/api/me');
  return data;
}

// --- Credit Cards API ---
export async function getCreditCards(): Promise<CreditCard[]> {
  const { data } = await api.get<CreditCard[]>('/api/credit_cards');
  return data;
}

export async function createCreditCard(card: Omit<CreditCard, 'id'>): Promise<CreditCard> {
  const { data } = await api.post<CreditCard>('/api/credit_cards', card);
  return data;
}

export async function updateCreditCard(card: CreditCard): Promise<CreditCard> {
  const { data } = await api.put<CreditCard>(`/api/credit_cards/${card.id}`, card);
  return data;
}

export async function deleteCreditCard(id: number): Promise<void> {
  await api.delete(`/api/credit_cards/${id}`);
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
    // Clear cookie with same path
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

export default {
  login,
  signup,
  getCurrentUser,
  getCreditCards,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  logout,
}; 