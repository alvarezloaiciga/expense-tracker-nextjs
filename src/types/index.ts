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

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  budget: number;
  transaction_count: number;
  total_spent: number;
}

export interface Transaction {
  id: number;
  credit_card_id: number;
  category_id?: number;
  amount: string; // using string for decimal precision
  currency: string;
  reference_id: string;
  merchant_name: string;
  city?: string;
  country?: string;
  transaction_date: string; // ISO string
  authorization_code?: string;
  transaction_type: "EXPENSE" | "INCOME";
  created_at: string; // ISO string
  updated_at: string; // ISO string
  email_content?: string;
}

export interface DashboardStats {
  summary: {
    total_spending: number;
    largest_category: { name: string; amount: number; percent: number };
    transaction_count: number;
    average_transaction: number;
    trend: {
      total_spending_pct_change: number;
      transaction_count_pct_change: number;
      average_transaction_pct_change: number;
    };
  };
  daily_spending_trend: { date: string; amount: number }[];
  spending_by_category: { category: string; amount: number; percent: number }[];
  top_vendors: { merchant: string; amount: number }[];
} 