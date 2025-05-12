import type { Metadata } from "next"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceChart } from "./components/PerformanceChart"
import { CheckinHeatmap } from "./components/CheckinHeatmap"
import { ProductChart } from "./components/ProductChart"
import { UserProfile } from "./components/UserProfile"

export const metadata: Metadata = {
  title: "MotelHub | Dashboard",
  description: "Visualize métricas e desempenho do seu negócio",
}

export default async function DashboardPage() {
  // Normalmente estes dados viriam de uma API
  const metricsData = [
    { title: "Faturamento Reservas", value: "R$ 523.000", icon: TrendingUp, color: "bg-pink-500" },
    { title: "Faturamento Produtos", value: "R$ 808.000", icon: TrendingUp, color: "bg-emerald-500" },
    { title: "Receita Total", value: "R$ 1.012.000", icon: TrendingUp, color: "bg-orange-500" },
    { title: "Lucro Total", value: "R$ 2.343.000", icon: TrendingUp, color: "bg-blue-500" },
  ]

  const productAData = [
    { trimestre: "Trim1", valor: 117000 },
    { trimestre: "Trim2", valor: 134000 },
    { trimestre: "Trim3", valor: 127000 },
    { trimestre: "Trim4", valor: 145000 },
  ]

  const productBData = [
    { trimestre: "Trim1", valor: 105000 },
    { trimestre: "Trim2", valor: 130000 },
    { trimestre: "Trim3", valor: 95000 },
    { trimestre: "Trim4", valor: 120000 },
  ]

  const productCData = [
    { trimestre: "Trim1", valor: 95000 },
    { trimestre: "Trim2", valor: 110000 },
    { trimestre: "Trim3", valor: 125000 },
    { trimestre: "Trim4", valor: 140000 },
  ]

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-zinc-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-1 gap-4">
          {metricsData.map((metric, index) => (
            <Card key={index} className="bg-zinc-800 border-zinc-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-200">{metric.title}</CardTitle>
                <div className={`h-8 w-8 rounded-full ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Faturamento e Impacto</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Heatmap de Check-ins / Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckinHeatmap />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Produto A</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductChart data={productAData} color="#f43f5e" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Produto B</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductChart data={productBData} color="#10b981" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Produto C</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductChart data={productCData} color="#f97316" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
