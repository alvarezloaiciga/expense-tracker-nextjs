"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

interface DailySpendingTrendProps {
  data?: { date: string; amount: number }[]
  currency?: CurrencyCode
}

export function DailySpendingTrend({ data, currency = "USD" }: DailySpendingTrendProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            // Show only every 5th label to avoid crowding
            const index = data.findIndex((item) => item.date === value)
            return index % 5 === 0 ? value : ""
          }}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, currency)} />
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
