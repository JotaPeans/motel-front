import type { Metadata } from "next"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PerformanceChart } from "./components/PerformanceChart"
import { CheckinHeatmap } from "./components/CheckinHeatmap"
import { UserProfile } from "./components/UserProfile"

import { getAllRooms } from "@/app/api/room/getAll"
import { getAllReservations } from "@/app/api/reservation/getAll"
import { getAllConsumos } from "@/app/api/consumo/getAll"

import { Room } from "@/lib/types/Room"
import { Reservation } from "@/lib/types/Reservation"
import { Consumo } from "@/lib/types/Consumo"

export const metadata: Metadata = {
  title: "MotelHub | Dashboard",
  description: "Visualize métricas e desempenho do seu negócio",
}

export default async function DashboardPage() {
  // 1. Buscar rooms, reservations e consumptions em paralelo
  const [roomsData, reservationsData, consumptionsData] = await Promise.all([
    getAllRooms(),
    getAllReservations(),
    getAllConsumos(),
  ])

  const rooms: Room[] = roomsData.data ?? []
  const reservations: Reservation[] = reservationsData.data ?? []
  const consumptions: Consumo[] = consumptionsData.data ?? []

  // 2. Mapa quartoId → preço
  const priceMap = new Map<number, number>(
    rooms.map((room) => [room.id, room.valor]),
  )

  // 3. Filtrar reservas finalizadas com check-out
  const finalized = reservations.filter(
    (r) => r.status === "FINALIZADA" && r.data_checkout,
  )

  // 4. Calcular faturamento de quartos
  const faturamentoReservas = finalized.reduce((sum, r) => {
    return sum + (priceMap.get(r.quartoId) ?? 0)
  }, 0)

  // 5. Calcular faturamento de consumos
  const faturamentoConsumo = consumptions.reduce((sum, c) => {
    return sum + (c.valor ?? 0)
  }, 0)

  // 6. Receita total
  const receitaTotal = faturamentoReservas + faturamentoConsumo

  // 7. Métricas dinâmicas
  const metricsData = [
    {
      title: "Faturamento Reservas",
      value: `R$ ${faturamentoReservas.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-pink-500",
    },
    {
      title: "Faturamento Consumos",
      value: `R$ ${faturamentoConsumo.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${receitaTotal.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  // 8. Dados para gráfico de performance (check-out → receita de quartos)
  const performanceData = finalized.map((r) => ({
    date: new Date(r.data_checkout!),
    value: priceMap.get(r.quartoId) ?? 0,
  }))

  // 9. Dados para heatmap de check-in / check-out
  const heatmapData = reservations.flatMap((r) => {
    const events = [{ date: new Date(r.data_checkin), type: "check-in" }]
    if (r.data_checkout) {
      events.push({ date: new Date(r.data_checkout), type: "check-out" })
    }
    return events
  })

  return (
    <main className="flex flex-1 overflow-y-auto flex-col gap-4 p-4 md:gap-8 md:p-8 bg-zinc-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-3 grid grid-cols-1 gap-4">
          {metricsData.map((metric, i) => (
            <Card key={i} className="bg-zinc-800 border-zinc-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-200">
                  {metric.title}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-full ${metric.color} flex items-center justify-center`}
                >
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {metric.value}
                </div>
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
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Heatmap de Check-ins / Check-outs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CheckinHeatmap reservations={reservations} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
