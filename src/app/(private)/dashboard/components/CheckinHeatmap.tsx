"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados simulados para o heatmap
const generateHeatmapData = (seed: number) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return days.flatMap((day) => {
    return hours.map((hour) => {
      // Padrão de check-in: mais frequente à tarde/noite
      let value = 0
      if (seed === 1) {
        // Check-ins
        // Mais check-ins à noite, especialmente em finais de semana
        if (day === "Sex" || day === "Sáb") {
          if (hour >= 18 && hour <= 23) {
            value = Math.floor(Math.random() * 15) + 10 // 10-25
          } else if (hour >= 14 && hour < 18) {
            value = Math.floor(Math.random() * 10) + 5 // 5-15
          } else {
            value = Math.floor(Math.random() * 5) // 0-5
          }
        } else {
          if (hour >= 18 && hour <= 23) {
            value = Math.floor(Math.random() * 10) + 3 // 3-13
          } else if (hour >= 14 && hour < 18) {
            value = Math.floor(Math.random() * 7) + 2 // 2-9
          } else {
            value = Math.floor(Math.random() * 3) // 0-3
          }
        }
      } else {
        // Check-outs
        // Mais check-outs pela manhã/tarde
        if (day === "Dom" || day === "Seg") {
          if (hour >= 8 && hour <= 12) {
            value = Math.floor(Math.random() * 15) + 8 // 8-23
          } else if (hour >= 13 && hour <= 15) {
            value = Math.floor(Math.random() * 10) + 5 // 5-15
          } else {
            value = Math.floor(Math.random() * 5) // 0-5
          }
        } else {
          if (hour >= 8 && hour <= 12) {
            value = Math.floor(Math.random() * 10) + 3 // 3-13
          } else if (hour >= 13 && hour <= 15) {
            value = Math.floor(Math.random() * 7) + 2 // 2-9
          } else {
            value = Math.floor(Math.random() * 3) // 0-3
          }
        }
      }

      return {
        hour,
        day,
        value,
      }
    })
  })
}

const checkinData = generateHeatmapData(1)
const checkoutData = generateHeatmapData(2)

// Função para determinar a cor baseada no valor
const getColor = (value: number, max: number) => {
  // Escala de cores de azul claro a azul escuro
  const intensity = Math.min(value / max, 1)

  if (intensity < 0.1) return "bg-blue-50/10 text-blue-100/30"
  if (intensity < 0.2) return "bg-blue-100/20 text-blue-100/40"
  if (intensity < 0.3) return "bg-blue-200/30 text-blue-100/50"
  if (intensity < 0.4) return "bg-blue-300/40 text-blue-100/60"
  if (intensity < 0.5) return "bg-blue-400/50 text-blue-100/70"
  if (intensity < 0.6) return "bg-blue-500/60 text-blue-100/80"
  if (intensity < 0.7) return "bg-blue-600/70 text-white"
  if (intensity < 0.8) return "bg-blue-700/80 text-white"
  if (intensity < 0.9) return "bg-blue-800/90 text-white"
  return "bg-blue-900 text-white"
}

export function CheckinHeatmap() {
  const [activeTab, setActiveTab] = useState("check-in")
  const data = activeTab === "check-in" ? checkinData : checkoutData

  // Encontrar o valor máximo para escala de cores
  const maxValue = Math.max(...data.map((d) => d.value))

  // Horas e dias para os cabeçalhos
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="h-full">
      <Tabs defaultValue="check-in" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="check-in">Check-ins</TabsTrigger>
          <TabsTrigger value="check-out">Check-outs</TabsTrigger>
        </TabsList>

        <TabsContent value="check-in" className="mt-0">
          <div className="text-sm text-zinc-400 mb-2">Concentração de check-ins por hora e dia da semana</div>
          <div className="overflow-x-auto">
            <div className="heatmap min-w-[600px]">
              {/* Cabeçalho de horas */}
              <div className="flex border-b border-zinc-700">
                <div className="w-16 shrink-0"></div>
                {hours.map((hour) => (
                  <div key={hour} className="w-10 text-center text-xs py-1 text-zinc-500">
                    {hour}h
                  </div>
                ))}
              </div>

              {/* Linhas do heatmap */}
              {days.map((day) => (
                <div key={day} className="flex border-b border-zinc-800">
                  <div className="w-16 shrink-0 py-2 text-sm font-medium text-zinc-400">{day}</div>
                  {hours.map((hour) => {
                    const cell = data.find((d) => d.day === day && d.hour === hour)
                    const colorClass = getColor(cell?.value || 0, maxValue)

                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-10 h-8 flex items-center justify-center text-xs font-medium ${colorClass}`}
                        title={`${day} ${hour}h: ${cell?.value || 0} check-ins`}
                      >
                        {cell?.value || 0}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="check-out" className="mt-0">
          <div className="text-sm text-zinc-400 mb-2">Concentração de check-outs por hora e dia da semana</div>
          <div className="overflow-x-auto">
            <div className="heatmap min-w-[600px]">
              {/* Cabeçalho de horas */}
              <div className="flex border-b border-zinc-700">
                <div className="w-16 shrink-0"></div>
                {hours.map((hour) => (
                  <div key={hour} className="w-10 text-center text-xs py-1 text-zinc-500">
                    {hour}h
                  </div>
                ))}
              </div>

              {/* Linhas do heatmap */}
              {days.map((day) => (
                <div key={day} className="flex border-b border-zinc-800">
                  <div className="w-16 shrink-0 py-2 text-sm font-medium text-zinc-400">{day}</div>
                  {hours.map((hour) => {
                    const cell = data.find((d) => d.day === day && d.hour === hour)
                    const colorClass = getColor(cell?.value || 0, maxValue)

                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-10 h-8 flex items-center justify-center text-xs font-medium ${colorClass}`}
                        title={`${day} ${hour}h: ${cell?.value || 0} check-outs`}
                      >
                        {cell?.value || 0}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
