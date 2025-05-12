"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function UserProfile() {
  const [selectedYear, setSelectedYear] = useState<number>(2020)
  const [selectedRoom, setSelectedRoom] = useState<string>("Todos os Quartos")
  const [selectedProduct, setSelectedProduct] = useState<string>("Produto A")
  const years = [2018, 2019, 2020]
  const rooms = [
    { name: "Todos os Quartos", color: "bg-purple-600/20 text-purple-400 border-purple-800" },
    { name: "Suítes", color: "bg-yellow-600/20 text-yellow-400 border-yellow-800" },
    { name: "Deluxe", color: "bg-indigo-600/20 text-indigo-400 border-indigo-800" },
  ]
  const products = [
    { name: "Produto A", color: "bg-pink-600/20 text-pink-400 border-pink-800" },
    { name: "Produto B", color: "bg-emerald-600/20 text-emerald-400 border-emerald-800" },
    { name: "Produto C", color: "bg-blue-600/20 text-blue-400 border-blue-800" },
  ]

  return (
    <Card className="bg-zinc-800 border-zinc-700 h-full">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 border-2 border-zinc-700">
          <AvatarImage src="/placeholder-user.jpg" alt="Foto do usuário" />
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>

        <div className="text-center mt-6">
          <h3 className="text-lg font-semibold text-zinc-200">Ano de Análise</h3>
        </div>

        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-zinc-800 border-zinc-700 text-zinc-200">
                {selectedYear}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-trigger-width] bg-zinc-800 border-zinc-700">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  className={selectedYear === year ? "bg-blue-600 text-white" : "text-zinc-200 hover:bg-zinc-700"}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full mt-6">
          <h4 className="text-md font-semibold mb-2 text-zinc-200">Quartos em Análise</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between ${rooms.find((r) => r.name === selectedRoom)?.color || ""}`}
              >
                {selectedRoom}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-trigger-width] bg-zinc-800 border-zinc-700">
              {rooms.map((room) => (
                <DropdownMenuItem
                  key={room.name}
                  className={`${selectedRoom === room.name ? "bg-zinc-700" : ""} text-zinc-200 hover:bg-zinc-700`}
                  onClick={() => setSelectedRoom(room.name)}
                >
                  {room.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full mt-6">
          <h4 className="text-md font-semibold mb-2 text-zinc-200">Produtos em Análise</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between ${products.find((p) => p.name === selectedProduct)?.color || ""}`}
              >
                {selectedProduct}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-trigger-width] bg-zinc-800 border-zinc-700">
              {products.map((product) => (
                <DropdownMenuItem
                  key={product.name}
                  className={`${selectedProduct === product.name ? "bg-zinc-700" : ""} text-zinc-200 hover:bg-zinc-700`}
                  onClick={() => setSelectedProduct(product.name)}
                >
                  {product.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
