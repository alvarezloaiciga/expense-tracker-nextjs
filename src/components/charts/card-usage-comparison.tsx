"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"
import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import type { CreditCard } from "@/types"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

interface CardUsageComparisonProps {
  currency?: CurrencyCode
}

export function CardUsageComparison({ currency = "USD" }: CardUsageComparisonProps) {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: api.getCreditCards,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No credit cards found
      </div>
    )
  }

  // Filter out cards with no expenses in the selected currency
  const cardsWithExpenses = cards.filter(card => 
    card.expenses_by_currency && 
    card.expenses_by_currency[currency] && 
    card.expenses_by_currency[currency] > 0
  )
  
  if (cardsWithExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No expenses found for {currency}
      </div>
    )
  }

  const chartData = cardsWithExpenses.map((card) => ({
    name: card.name,
    value: (card.expenses_by_currency && card.expenses_by_currency[currency]) || 0
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Expenses"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
