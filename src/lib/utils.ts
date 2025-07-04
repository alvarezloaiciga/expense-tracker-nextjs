import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTotalExpenses(expenses: Record<string, number>): number {
  return Object.values(expenses).reduce((sum, amount) => sum + amount, 0)
}

export function getExpensesInCurrency(expenses: Record<string, number>, currency: string): number {
  return expenses[currency] || 0
}
