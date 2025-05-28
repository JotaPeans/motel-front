"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reservation } from "@/lib/types/Reservation"

type HeatmapEvent = {
  day: string    // "Dom", "Seg", …, "Sáb"
  hour: number   // 0–23
  count: number
}

interface CheckinHeatmapProps {
  reservations: Reservation[]
}

export function CheckinHeatmap({ reservations }: CheckinHeatmapProps) {
  const [activeTab, setActiveTab] = useState<"check-in" | "check-out">("check-in")

  // converte Date para dia da semana string
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const getDayName = (d: Date) => weekdayNames[d.getDay()]

  // agrupa em dois mapas: check-in e check-out
  const { checkinMap, checkoutMap } = useMemo(() => {
    const cIn = new Map<string, number>()   // chave = "Dom-18"
    const cOut = new Map<string, number>()

    reservations.forEach((r) => {
      // check-in
      const dtIn = new Date(r.data_checkin)
      const keyIn = `${getDayName(dtIn)}-${dtIn.getHours()}`
      cIn.set(keyIn, (cIn.get(keyIn) || 0) + 1)

      // check-out, se houver
      if (r.data_checkout) {
        const dtOut = new Date(r.data_checkout)
        const keyOut = `${getDayName(dtOut)}-${dtOut.getHours()}`
        cOut.set(keyOut, (cOut.get(keyOut) || 0) + 1)
      }
    })

    return { checkinMap: cIn, checkoutMap: cOut }
  }, [reservations])

  // Gera array de eventos para renderizar
  const makeEvents = (map: Map<string, number>): HeatmapEvent[] => {
    const days = weekdayNames
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const events: HeatmapEvent[] = []

    days.forEach((day) =>
      hours.forEach((hour) => {
        const key = `${day}-${hour}`
        events.push({ day, hour, count: map.get(key) || 0 })
      })
    )

    return events
  }

  const checkinData = useMemo(() => makeEvents(checkinMap), [checkinMap])
  const checkoutData = useMemo(() => makeEvents(checkoutMap), [checkoutMap])

  // cor baseado em escala
  const allCounts = [...checkinData, ...checkoutData].map((e) => e.count)
  const maxCount = Math.max(...allCounts, 1)
  const getColor = (v: number) => {
    const t = Math.min(v / maxCount, 1)
    if (t < 0.1) return "bg-blue-50/10 text-blue-100/30"
    if (t < 0.2) return "bg-blue-100/20 text-blue-100/40"
    if (t < 0.3) return "bg-blue-200/30 text-blue-100/50"
    if (t < 0.4) return "bg-blue-300/40 text-blue-100/60"
    if (t < 0.5) return "bg-blue-400/50 text-blue-100/70"
    if (t < 0.6) return "bg-blue-500/60 text-blue-100/80"
    if (t < 0.7) return "bg-blue-600/70 text-white"
    if (t < 0.8) return "bg-blue-700/80 text-white"
    if (t < 0.9) return "bg-blue-800/90 text-white"
    return "bg-blue-900 text-white"
  }

  const data = activeTab === "check-in" ? checkinData : checkoutData

  return (
    <div className="h-full">
      <Tabs defaultValue="check-in" onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="check-in">Check-ins</TabsTrigger>
          <TabsTrigger value="check-out">Check-outs</TabsTrigger>
        </TabsList>

        <TabsContent value="check-in">
          <div className="text-sm text-zinc-400 mb-2">
            Concentração de check-ins por hora e dia
          </div>
          {renderGrid(data)}
        </TabsContent>

        <TabsContent value="check-out">
          <div className="text-sm text-zinc-400 mb-2">
            Concentração de check-outs por hora e dia
          </div>
          {renderGrid(data)}
        </TabsContent>
      </Tabs>
    </div>
  )

  // função interna para renderizar o grid
  function renderGrid(events: HeatmapEvent[]) {
    const days = weekdayNames
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="overflow-x-auto">
        <div className="heatmap min-w-[600px]">
          <div className="flex border-b border-zinc-700">
            <div className="w-16" />
            {hours.map((h) => (
              <div key={h} className="w-10 text-center text-xs py-1 text-zinc-500">
                {h}h
              </div>
            ))}
          </div>
          {days.map((day) => (
            <div key={day} className="flex border-b border-zinc-800">
              <div className="w-16 py-2 text-sm font-medium text-zinc-400">{day}</div>
              {hours.map((hour) => {
                const evt = events.find((e) => e.day === day && e.hour === hour)!
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`w-10 h-8 flex items-center justify-center text-xs font-medium ${getColor(evt.count)}`}
                    title={`${day} ${hour}h: ${evt.count}`}
                  >
                    {evt.count}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
