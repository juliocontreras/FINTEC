"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Alimentación", value: 1200, color: "#0088FE" },
  { name: "Transporte", value: 800, color: "#00C49F" },
  { name: "Entretenimiento", value: 600, color: "#FFBB28" },
  { name: "Servicios", value: 400, color: "#FF8042" },
  { name: "Salud", value: 300, color: "#8884D8" },
  { name: "Otros", value: 200, color: "#82CA9D" },
]

export function ExpensesChart() {
  return (
    <div className="h-[300px]">
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
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`$${value.toLocaleString()}`, "Gasto"]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
