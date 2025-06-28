"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"

const data = [
  { name: "Whole Foods", amount: 243.56 },
  { name: "Amazon", amount: 187.43 },
  { name: "Starbucks", amount: 124.87 },
  { name: "Target", amount: 98.76 },
  { name: "Uber", amount: 87.65 },
]

export function TopVendors() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 70,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
          <XAxis type="number" tickFormatter={(value) => `$${value}`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
          <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
          <Bar dataKey="amount" fill="#8884d8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
