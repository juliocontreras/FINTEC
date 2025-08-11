"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Ene", value: 95000 },
  { month: "Feb", value: 98000 },
  { month: "Mar", value: 102000 },
  { month: "Abr", value: 105000 },
  { month: "May", value: 108000 },
  { month: "Jun", value: 112000 },
  { month: "Jul", value: 115000 },
  { month: "Ago", value: 118000 },
  { month: "Sep", value: 121000 },
  { month: "Oct", value: 123000 },
  { month: "Nov", value: 125000 },
  { month: "Dic", value: 125430 },
]

export function PatrimonioChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: any) => [`$${value.toLocaleString()}`, "Patrimonio"]}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
