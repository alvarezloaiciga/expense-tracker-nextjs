"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"

const data = [
  { name: "Groceries", value: 543.21 },
  { name: "Dining", value: 423.45 },
  { name: "Entertainment", value: 321.67 },
  { name: "Transportation", value: 287.32 },
  { name: "Shopping", value: 198.76 },
  { name: "Other", value: 156.89 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function SpendingByCategory() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
