// Currency utilities
export const CURRENCIES = {
  USD: { symbol: "$", code: "USD", name: "US Dollar" },
  CRC: { symbol: "₡", code: "CRC", name: "Costa Rican Colón" },
  EUR: { symbol: "€", code: "EUR", name: "Euro" },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const currencyInfo = CURRENCIES[currency]

  if (currency === "CRC") {
    // Format Colones with no decimals and comma separators
    return `${currencyInfo.symbol}${Math.round(amount).toLocaleString("es-CR")}`
  } else {
    // Format other currencies with 2 decimals
    return `${currencyInfo.symbol}${amount.toFixed(2)}`
  }
}