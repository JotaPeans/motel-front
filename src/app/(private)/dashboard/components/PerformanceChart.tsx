"use client"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const data = [
  { name: "Jan", valor: 65000 },
  { name: "Fev", valor: 60000 },
  { name: "Mar", valor: 80000 },
  { name: "Abr", valor: 75000 },
  { name: "Mai", valor: 90000 },
  { name: "Jun", valor: 85000 },
  { name: "Jul", valor: 95000 },
  { name: "Ago", valor: 100000 },
  { name: "Set", valor: 90000 },
  { name: "Out", valor: 95000 },
  { name: "Nov", valor: 105000 },
  { name: "Dez", valor: 110000 },
]

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af" }} axisLine={{ stroke: "#444" }} />
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
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="valor" stroke="#3b82f6" fill="url(#colorUv)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
