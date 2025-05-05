"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ProductChartProps {
  data: Array<{ trimestre: string; valor: number }>
  color: string
}

export function ProductChart({ data, color }: ProductChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis dataKey="trimestre" tick={{ fill: "#9ca3af" }} axisLine={{ stroke: "#444" }} />
          <YAxis
            tick={{ fill: "#9ca3af" }}
            axisLine={{ stroke: "#444" }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#27272a", borderColor: "#3f3f46", color: "white" }}
            labelStyle={{ color: "white" }}
            formatter={(value) => [`R$ ${value}`, "Valor"]}
          />
          <Bar dataKey="valor" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
