// Currency utilities
export const CURRENCIES = {
  USD: { symbol: "$", code: "USD", name: "US Dollar" },
  CRC: { symbol: "₡", code: "CRC", name: "Costa Rican Colón" },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

// Approximate exchange rate (in a real app, this would come from an API)
export const EXCHANGE_RATES = {
  USD_TO_CRC: 520,
  CRC_TO_USD: 1 / 520,
}

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const currencyInfo = CURRENCIES[currency]

  if (currency === "CRC") {
    // Format Colones with no decimals and comma separators
    return `${currencyInfo.symbol}${Math.round(amount).toLocaleString("es-CR")}`
  } else {
    // Format USD with 2 decimals
    return `${currencyInfo.symbol}${amount.toFixed(2)}`
  }
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount

  if (from === "USD" && to === "CRC") {
    return amount * EXCHANGE_RATES.USD_TO_CRC
  } else if (from === "CRC" && to === "USD") {
    return amount * EXCHANGE_RATES.CRC_TO_USD
  }

  return amount
}
