"use client";
import { Consumo } from "@/lib/types/Consumo";
import { Reservation } from "@/lib/types/Reservation";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface PerformanceChartProps {
  reservations: Reservation[];
  consumptions: Consumo[];
}

const mesesAbreviados = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function PerformanceChart({
  consumptions,
  reservations,
}: PerformanceChartProps) {
  const chartData = [
    { name: "Jan", valor: 0 },
    { name: "Fev", valor: 0 },
    { name: "Mar", valor: 0 },
    { name: "Abr", valor: 0 },
    { name: "Mai", valor: 0 },
    { name: "Jun", valor: 0 },
    { name: "Jul", valor: 0 },
    { name: "Ago", valor: 0 },
    { name: "Set", valor: 0 },
    { name: "Out", valor: 0 },
    { name: "Nov", valor: 0 },
    { name: "Dez", valor: 0 },
  ];

  consumptions.forEach((c) => {
    const monthInChartDataIndex = chartData.findIndex((d) => {
      const date = new Date(c.data_consumo);
      const month = mesesAbreviados[date.getUTCMonth()];

      return d.name.toLowerCase() === month.toLowerCase();
    });

    chartData[monthInChartDataIndex].valor += c.valor * c.quantidade;
  });

  reservations.forEach((r) => {
    const monthInChartDataIndex = chartData.findIndex((d) => {
      const date = new Date(r.data_checkout);
      const month = mesesAbreviados[date.getUTCMonth()];

      return d.name.toLowerCase() === month.toLowerCase();
    });

    chartData[monthInChartDataIndex].valor += r.quarto_preco;
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9ca3af" }}
            axisLine={{ stroke: "#444" }}
          />
          <YAxis
            tick={{ fill: "#9ca3af" }}
            axisLine={{ stroke: "#444" }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              borderColor: "#3f3f46",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            formatter={(value) => [`R$ ${value}`, "Valor"]}
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            fill="url(#colorUv)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
