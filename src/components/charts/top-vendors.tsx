"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

interface TopVendorsProps {
  data?: { merchant: string; amount: number }[]
  currency?: CurrencyCode
}

export function TopVendors({ data, currency = "USD" }: TopVendorsProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>;
  }
  const chartData = data.map(({ merchant, amount }) => ({ name: merchant, amount }));
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 70,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
          <XAxis type="number" tickFormatter={(value) => formatCurrency(value, currency)} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
          <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
          <Bar dataKey="amount" fill="#8884d8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
