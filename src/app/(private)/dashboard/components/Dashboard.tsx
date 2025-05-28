"use client";

import { Calendar, DollarSign, Home, Package, TrendingUp } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Room, RoomTipo } from "@/lib/types/Room";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/Product";
import { getAllProducts } from "@/app/api/product/getAll";
import { Skeleton } from "@/components/ui/skeleton";
import { Reservation } from "@/lib/types/Reservation";
import { Consumo } from "@/lib/types/Consumo";
import { getAllRooms } from "@/app/api/room/getAll";
import { getAllConsumos } from "@/app/api/consumo/getAll";
import { getAllReservations } from "@/app/api/reservation/getAll";
import { PerformanceChart } from "./PerformanceChart";
import { CheckinHeatmap } from "./CheckinHeatmap";

const anoAtual = new Date().getFullYear();

const anos = [anoAtual, anoAtual - 1, anoAtual - 2];

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomTipo | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("0");

  const [products, setProducts] = useState<Product[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [consumptions, setConsumptions] = useState<Consumo[]>([]);

  const [isProductsFetchLoading, startFetchProducts] = useTransition();
  const [isFetchDataFilteredLoading, startFetchDataFiltered] = useTransition();

  useEffect(() => {
    startFetchProducts(async () => {
      const { data } = await getAllProducts();

      if (data) setProducts(data);
    });
  }, []);

  useEffect(() => {
    startFetchDataFiltered(async () => {
      const { data: roomsData } = await getAllRooms({
        filters: { room_type: selectedRoomType ?? undefined },
      });
      const { data: consumosData } = await getAllConsumos({
        size: 50000,
        filters: {
          ano_consumo:
            selectedYear?.getFullYear().toString() ?? anoAtual.toString(),
          produto_id: selectedProductId ?? undefined,
        },
      });
      const { data: reservationsData } = await getAllReservations({
        size: 50000,
        filters: {
          ano_reserva:
            selectedYear?.getFullYear().toString() ?? anoAtual.toString(),
          room_type: selectedRoomType ?? undefined,
        },
      });

      if (roomsData) setRooms(roomsData);
      if (consumosData) setConsumptions(consumosData);
      if (reservationsData) setReservations(reservationsData);
    });
  }, [selectedYear, selectedRoomType, selectedProductId]);

  const priceMap = new Map<number, number>(
    rooms.map((room) => [room.id, room.valor])
  );

  const reservationFiltered = reservations.filter(
    (r) => r.status !== "CANCELADA"
  );

  const faturamentoReservas = reservationFiltered.reduce((sum, r) => {
    return sum + (priceMap.get(r.quartoId) ?? 0);
  }, 0);

  const faturamentoConsumo = consumptions.reduce((sum, c) => {
    return sum + (c.valor ?? 0) * c.quantidade;
  }, 0);

  const receitaTotal = faturamentoReservas + faturamentoConsumo;

  return (
    <main className="flex flex-1 overflow-y-auto flex-col gap-4 p-4 md:gap-8 md:p-8 bg-zinc-900 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">AA</span>
          </div>
          <h1 className="text-2xl font-bold">Dashboard Analítico</h1>
        </div>

        {/* Intuitive Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <Select
              value={
                selectedYear?.getFullYear().toString() ?? anoAtual.toString()
              }
              onValueChange={(value) =>
                setSelectedYear(new Date(parseInt(value), 0, 1))
              }
            >
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anos.map((year, key) => (
                  <SelectItem key={key} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <Select
              value={selectedRoomType ?? "all"}
              onValueChange={(value) =>
                setSelectedRoomType(
                  value === "all" ? null : (value as RoomTipo)
                )
              }
            >
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Todos os Quartos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Quartos</SelectItem>
                <SelectItem value="SUITE">Suíte</SelectItem>
                <SelectItem value="DELUXE">Deluxe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isProductsFetchLoading ? (
                  <Skeleton className="w-full h-10 bg-zinc-900" />
                ) : (
                  <>
                    <SelectItem value="0">Todos os produtos</SelectItem>
                    {products.map((product, key) => (
                      <SelectItem key={key} value={product.id.toString()}>
                        {product.nome}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="bg-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Faturamento Reservas
            </CardTitle>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetchDataFilteredLoading ? (
                <Skeleton className="w-full h-10 bg-zinc-900" />
              ) : (
                Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(faturamentoReservas)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Faturamento Consumos
            </CardTitle>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetchDataFilteredLoading ? (
                <Skeleton className="w-full h-10 bg-zinc-900" />
              ) : (
                Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(faturamentoConsumo)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Receita Total
            </CardTitle>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFetchDataFilteredLoading ? (
                <Skeleton className="w-full h-10 bg-zinc-900" />
              ) : (
                Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(receitaTotal)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Faturamento e Impacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFetchDataFilteredLoading ? (
              <Skeleton className="w-full h-full bg-zinc-800" />
            ) : (
              <PerformanceChart
                reservations={reservations}
                consumptions={consumptions}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Heatmap de Check-ins / Check-outs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFetchDataFilteredLoading ? (
              <Skeleton className="w-full h-full bg-zinc-800" />
            ) : (
              <CheckinHeatmap reservations={reservations} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
