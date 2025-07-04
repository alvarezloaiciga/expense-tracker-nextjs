"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

interface SpendingByCategoryProps {
  data?: { category: string; amount: number; percent?: number }[]
  currency?: CurrencyCode
}

export function SpendingByCategory({ data, currency = "USD" }: SpendingByCategoryProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>;
  }
  const chartData = data.map(({ category, amount }) => ({ name: category, value: amount }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
