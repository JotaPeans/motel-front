import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomList } from "./components/RoomList";
import { getAllRooms } from "../api/room/getAll";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Room Management",
  description: "Manage motel rooms and their status",
};

export default async function RoomsPage() {
  const { data } = await getAllRooms();

  if (data === null) return redirect("/");

  const totalRooms = data.length;
  const busyRoomsLength = data.filter(
    (room) => room.status === "OCUPADO"
  ).length;
  const availableRoomsLength = data.filter(
    (room) => room.status === "DISPONIVEL"
  ).length;
  const maintenceRoomsLength = data.filter(
    (room) => room.status === "MANUTENCAO"
  ).length;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BedDouble className="h-6 w-6" />
          <span>Motel Manager</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/reservations">Reservas</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/guests">Clientes</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/new-reservation">Nova Reserva</Link>
          </Button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciamento de Quartos</h1>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Quarto
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quartos Totais
              </CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busyRoomsLength}</div>
              <p className="text-xs text-muted-foreground">
                {((busyRoomsLength / totalRooms) * 100).toFixed(0)}% do total de quartos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponível</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableRoomsLength}</div>
              <p className="text-xs text-muted-foreground">
                {((availableRoomsLength / totalRooms) * 100).toFixed(0)}% do total de quartos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
              <div className="h-4 w-4 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenceRoomsLength}</div>
              <p className="text-xs text-muted-foreground">
                {((maintenceRoomsLength / totalRooms) * 100).toFixed(0)}% do total de quartos
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Quartos</CardTitle>
            <CardDescription>
              Gerencie todos os quartos e seu status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomList rooms={data} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
