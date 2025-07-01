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