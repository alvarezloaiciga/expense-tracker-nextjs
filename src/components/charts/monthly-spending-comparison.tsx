"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

const data = [
  {
    name: "Jan",
    "2022": 2400,
    "2023": 2800,
  },
  {
    name: "Feb",
    "2022": 1398,
    "2023": 2210,
  },
  {
    name: "Mar",
    "2022": 2800,
    "2023": 2290,
  },
  {
    name: "Apr",
    "2022": 3908,
    "2023": 3000,
  },
  {
    name: "May",
    "2022": 2800,
    "2023": 2500,
  },
  {
    name: "Jun",
    "2022": 2800,
    "2023": 2700,
  },
  {
    name: "Jul",
    "2022": 3800,
    "2023": 3100,
  },
  {
    name: "Aug",
    "2022": 2800,
    "2023": 2900,
  },
  {
    name: "Sep",
    "2022": 2800,
    "2023": 2400,
  },
  {
    name: "Oct",
    "2022": 2800,
    "2023": 2700,
  },
  {
    name: "Nov",
    "2022": 3800,
    "2023": 3500,
  },
  {
    name: "Dec",
    "2022": 4300,
    "2023": 3900,
  },
]

interface MonthlySpendingComparisonProps {
  currency?: CurrencyCode
}

export function MonthlySpendingComparison({ currency = "USD" }: MonthlySpendingComparisonProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
        <Legend />
        <Bar dataKey="2022" fill="#8884d8" name="2022" />
        <Bar dataKey="2023" fill="#82ca9d" name="2023" />
      </BarChart>
    </ResponsiveContainer>
  )
}
