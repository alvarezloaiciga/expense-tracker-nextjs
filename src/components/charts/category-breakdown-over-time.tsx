"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { formatCurrency, type CurrencyCode } from "@/lib/currency"

const data = [
  {
    name: "Jan",
    Groceries: 400,
    Dining: 240,
    Entertainment: 180,
    Transportation: 200,
    Shopping: 280,
  },
  {
    name: "Feb",
    Groceries: 380,
    Dining: 218,
    Entertainment: 240,
    Transportation: 180,
    Shopping: 250,
  },
  {
    name: "Mar",
    Groceries: 450,
    Dining: 280,
    Entertainment: 220,
    Transportation: 190,
    Shopping: 220,
  },
  {
    name: "Apr",
    Groceries: 420,
    Dining: 300,
    Entertainment: 250,
    Transportation: 210,
    Shopping: 320,
  },
  {
    name: "May",
    Groceries: 540,
    Dining: 350,
    Entertainment: 210,
    Transportation: 290,
    Shopping: 290,
  },
  {
    name: "Jun",
    Groceries: 490,
    Dining: 380,
    Entertainment: 230,
    Transportation: 250,
    Shopping: 310,
  },
]

interface CategoryBreakdownOverTimeProps {
  currency?: CurrencyCode
}

export function CategoryBreakdownOverTime({ currency = "USD" }: CategoryBreakdownOverTimeProps) {
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
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
        <Tooltip formatter={(value) => [formatCurrency(value as number, currency), "Amount"]} />
        <Legend />
        <Area type="monotone" dataKey="Groceries" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="Dining" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="Entertainment" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="Transportation" stackId="1" stroke="#ff8042" fill="#ff8042" />
        <Area type="monotone" dataKey="Shopping" stackId="1" stroke="#0088fe" fill="#0088fe" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
