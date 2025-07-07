import axios from 'axios';
import type { UserSettings, CreditCard, Category, Transaction, DashboardStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use(async (config) => {
  // For now, we'll handle token injection at the component level
  // This is because Auth0 tokens need to be accessed from React context
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on network errors (like when backend is not running)
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('Network error - backend server may not be running');
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      // Auth0 will handle token refresh automatically
      console.log('401 error - Auth0 will handle token refresh');
    }
    return Promise.reject(error);
  }
);

// Helper function to create authenticated API instance
export const createAuthenticatedApi = (accessToken: string) => {
  const authenticatedApi = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return authenticatedApi;
};

// --- Settings API ---
export async function getUserSettings(accessToken: string): Promise<UserSettings> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.get<UserSettings>('/api/settings');
  return data;
}

export async function updateUserSettings(settings: UserSettings, accessToken: string): Promise<UserSettings> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.put<UserSettings>('/api/settings', { settings });
  return data;
}

// --- Credit Cards API ---
export async function getCreditCards(accessToken: string): Promise<CreditCard[]> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.get<CreditCard[]>('/api/credit_cards');
  return data;
}

export async function createCreditCard(card: Omit<CreditCard, 'id' | 'expenses_by_currency'>, accessToken: string): Promise<CreditCard> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.post<CreditCard>('/api/credit_cards', card);
  return data;
}

export async function updateCreditCard(card: CreditCard, accessToken: string): Promise<CreditCard> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.put<CreditCard>(`/api/credit_cards/${card.id}`, card);
  return data;
}

export async function deleteCreditCard(id: number, accessToken: string): Promise<void> {
  const api = createAuthenticatedApi(accessToken);
  await api.delete(`/api/credit_cards/${id}`);
}

// --- Categories API ---
export async function getCategories(accessToken: string): Promise<Category[]> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.get<Category[]>('/api/categories');
  return data;
}

export async function createCategory(category: { name: string; color: string; budget: number }, accessToken: string): Promise<Category> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.post<Category>('/api/categories', category);
  return data;
}

export async function updateCategory(category: { id: number; name: string; color: string; budget: number }, accessToken: string): Promise<Category> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.put<Category>(`/api/categories/${category.id}`, category);
  return data;
}

export async function deleteCategory(id: number, accessToken: string): Promise<void> {
  const api = createAuthenticatedApi(accessToken);
  await api.delete(`/api/categories/${id}`);
}

// --- Transactions API ---
export async function getTransactions(params: {
  page?: number;
  category_id?: number;
  credit_card_id?: number;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
} = {}, accessToken: string): Promise<{ transactions: Transaction[]; pagination: any }> {
  const api = createAuthenticatedApi(accessToken);
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.category_id) query.append('category_id', params.category_id.toString());
  if (params.credit_card_id) query.append('credit_card_id', params.credit_card_id.toString());
  if (params.transaction_type) query.append('transaction_type', params.transaction_type);
  if (params.start_date) query.append('start_date', params.start_date);
  if (params.end_date) query.append('end_date', params.end_date);
  if (params.search) query.append('search', params.search);
  const { data } = await api.get(`/api/transactions?${query.toString()}`);
  return { transactions: data.transactions, pagination: data.pagination };
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>, accessToken: string): Promise<Transaction> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.post<Transaction>('/api/transactions', transaction);
  return data;
}

export async function updateTransaction(transaction: Transaction, accessToken: string): Promise<Transaction> {
  const api = createAuthenticatedApi(accessToken);
  const { data } = await api.put<Transaction>(`/api/transactions/${transaction.id}`, transaction);
  return data;
}

export async function deleteTransaction(id: number, accessToken: string): Promise<void> {
  const api = createAuthenticatedApi(accessToken);
  await api.delete(`/api/transactions/${id}`);
}

// --- Dashboard API ---
export async function getDashboardStats(params: {
  from: string;
  to: string;
  currency?: string;
}, accessToken: string): Promise<DashboardStats> {
  const api = createAuthenticatedApi(accessToken);
  const query = new URLSearchParams();
  query.append('from', params.from);
  query.append('to', params.to);
  if (params.currency) {
    query.append('currency', params.currency);
  }
  const { data } = await api.get<DashboardStats>(`/api/dashboard/stats?${query.toString()}`);
  return data;
}

export default {
  getUserSettings,
  updateUserSettings,
  getCreditCards,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
}; 