import type { Metadata } from "next"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceChart } from "./components/PerformanceChart"
import { CheckinHeatmap } from "./components/CheckinHeatmap"
import { ProductChart } from "./components/ProductChart"
import { UserProfile } from "./components/UserProfile"

import { getAllRooms } from "@/app/api/room/getAll"
import { getAllReservations } from "@/app/api/reservation/getAll"

import { Room } from "@/lib/types/Room"
import { Reservation } from "@/lib/types/Reservation"

export const metadata: Metadata = {
  title: "MotelHub | Dashboard",
  description: "Visualize métricas e desempenho do seu negócio",
}

export default async function DashboardPage() {
  // 1. Buscar rooms e reservations em paralelo
  const [roomsData, reservationsData] = await Promise.all([
    getAllRooms(),
    getAllReservations(),
  ])

  const rooms: Room[] = roomsData.data ?? []
  const reservations: Reservation[] = reservationsData.data ?? []

  // 2. Criar um mapa quartoId → preço
  const priceMap = new Map<number, number>(
    rooms.map((room: Room) => [room.id, room.valor]),
  )

  // 3. Filtrar só reservas finalizadas e somar faturamento
  const finalized = reservations.filter(r => r.status === "FINALIZADA")
  const faturamentoReservas = finalized.reduce((sum, r) => {
    const preco = priceMap.get(r.quartoId) ?? 0
    return sum + preco
  }, 0)

  // 4. (Exemplo) Supondo que você tenha vendas de produtos:
  //    const { data: products } = await getAllProducts()
  //    const faturamentoProdutos = products.reduce((s,p) => s + p.price * p.qty, 0)
  // Por ora, vamos reutilizar faturamentoReservas como placeholder:

  // const faturamentoProdutos = faturamentoReservas * 0.6

  const receitaTotal = faturamentoReservas + 0
  const margemLucro   = 0.25  // ex.: 25%
  const lucroTotal    = receitaTotal  // receita Total+ custo produtos quando tiver produtos pronto

  // 5. Montar o array de métricas dinâmicas
  const metricsData = [
    {
      title: "Faturamento Reservas",
      value: `R$ ${faturamentoReservas.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-pink-500",
    },
    {
      title: "Faturamento Produtos",
      // value: `R$ ${faturamentoProdutos.toLocaleString("pt-BR")}`, colocar variavel dos produtos quando tiver pronto
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${receitaTotal.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
    {
      title: "Lucro Total",
      value: `R$ ${lucroTotal.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-blue-500",
    },
  ]

  // 6. Agrupar por trimestre para o gráfico de produto/exemplo
  const quarters: Record<string, number> = {}
  finalized.forEach(r => {
    const date = new Date(r.data)
    const q = `Trim${Math.floor(date.getMonth() / 3) + 1}`
    const preco = priceMap.get(r.quartoId) ?? 0
    quarters[q] = (quarters[q] || 0) + preco
  })
  const productAData = Object.entries(quarters).map(([trimestre, valor]) => ({ trimestre, valor }))

  // 7. Preparar dados para PerformanceChart (receita diária)
  const performanceData = finalized.map(r => ({
    date: new Date(r.data),
    value: priceMap.get(r.quartoId) ?? 0,
  }))

  // 8. Preparar dados para o Heatmap de check‐in/out
  const heatmapData = reservations.map(r => ({
    date: new Date(r.data),
    type: r.status === "FINALIZADA" ? "check-out" : "check-in",
  }))

  return (
    <main className="flex flex-1 overflow-y-auto flex-col gap-4 p-4 md:gap-8 md:p-8 bg-zinc-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-1 gap-4">
          {metricsData.map((metric, i) => (
            <Card key={i} className="bg-zinc-800 border-zinc-700">
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
            {/* Passe os dados via prop */}
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Heatmap de Check-ins / Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckinHeatmap data={heatmapData} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Receita por Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductChart data={productAData} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
