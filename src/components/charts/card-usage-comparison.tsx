"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

const data = [
  { name: "Chase Sapphire", value: 1543.21 },
  { name: "Amex Gold", value: 987.65 },
  { name: "Visa Signature", value: 654.32 },
  { name: "Discover It", value: 321.54 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

interface CardUsageComparisonProps {
  currency?: CurrencyCode
}

export function CardUsageComparison({ currency = "USD" }: CardUsageComparisonProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
