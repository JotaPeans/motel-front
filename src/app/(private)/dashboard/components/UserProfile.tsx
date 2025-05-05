"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function UserProfile() {
  const [selectedYear, setSelectedYear] = useState<number>(2020)
  const years = [2018, 2019, 2020]

  return (
    <Card className="bg-zinc-800 border-zinc-700 h-full">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 border-2 border-zinc-700">
          <AvatarImage src="/placeholder-user.jpg" alt="Foto do usuário" />
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-zinc-200">Ano de Análise</h3>
        </div>

        <div className="flex flex-col w-full gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              className={
                selectedYear === year
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-700"
              }
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>

        <div className="w-full mt-4">
          <h4 className="text-md font-semibold mb-2 text-zinc-200">Produtos de Análise</h4>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start bg-pink-600/20 text-pink-400 border-pink-800 hover:bg-pink-600/30"
            >
              Produto A
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-emerald-600/20 text-emerald-400 border-emerald-800 hover:bg-emerald-600/30"
            >
              Produto B
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-blue-600/20 text-blue-400 border-blue-800 hover:bg-blue-600/30"
            >
              Produto C
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
