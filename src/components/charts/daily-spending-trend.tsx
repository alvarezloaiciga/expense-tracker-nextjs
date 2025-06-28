"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

const data = [
  { date: "05/01", amount: 78.45 },
  { date: "05/02", amount: 42.32 },
  { date: "05/03", amount: 65.87 },
  { date: "05/04", amount: 98.76 },
  { date: "05/05", amount: 54.32 },
  { date: "05/06", amount: 32.54 },
  { date: "05/07", amount: 87.65 },
  { date: "05/08", amount: 45.67 },
  { date: "05/09", amount: 76.54 },
  { date: "05/10", amount: 34.56 },
  { date: "05/11", amount: 67.89 },
  { date: "05/12", amount: 43.21 },
  { date: "05/13", amount: 76.54 },
  { date: "05/14", amount: 23.45 },
  { date: "05/15", amount: 87.65 },
  { date: "05/16", amount: 45.67 },
  { date: "05/17", amount: 65.43 },
  { date: "05/18", amount: 34.56 },
  { date: "05/19", amount: 76.54 },
  { date: "05/20", amount: 54.32 },
  { date: "05/21", amount: 87.65 },
  { date: "05/22", amount: 43.21 },
  { date: "05/23", amount: 65.43 },
  { date: "05/24", amount: 34.56 },
  { date: "05/25", amount: 76.54 },
  { date: "05/26", amount: 23.45 },
  { date: "05/27", amount: 87.65 },
  { date: "05/28", amount: 45.67 },
  { date: "05/29", amount: 65.43 },
  { date: "05/30", amount: 34.56 },
]

export function DailySpendingTrend() {
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
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
