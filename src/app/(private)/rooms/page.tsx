import type { Metadata } from "next";
import { BedDouble } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomList } from "./components/RoomList";
import { getAllRooms } from "@/app/api/room/getAll";
import { redirect } from "next/navigation";
import AddQuarto from "./components/AddQuarto";
import { Room } from "@/lib/types/Room";

export const metadata: Metadata = {
  title: "MotelHub | Quartos",
  description: "Gerencie os quartos do motel e seu status",
};

export default async function RoomsPage() {
  const { data } = await getAllRooms();

  if (data === null) return redirect("/");

  const rooms: Room[] = data.map((room) => {
    if (room.clienteNome) {
      return {
        ...room,
        status: "OCUPADO",
      };
    } else {
      return {
        ...room,
      };
    }
  });

  const totalRooms = data.length;
  const busyRoomsLength = rooms.filter(
    (room) => room.status === "OCUPADO"
  ).length;
  const availableRoomsLength = rooms.filter(
    (room) => room.status === "DISPONIVEL"
  ).length;
  const maintenceRoomsLength = rooms.filter(
    (room) => room.status === "MANUTENCAO"
  ).length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Quartos</h1>
        <AddQuarto />
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
              {((busyRoomsLength / totalRooms) * 100).toFixed(0)}% do total de
              quartos
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
              {((availableRoomsLength / totalRooms) * 100).toFixed(0)}% do total
              de quartos
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
              {((maintenceRoomsLength / totalRooms) * 100).toFixed(0)}% do total
              de quartos
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
          <RoomList rooms={rooms} />
        </CardContent>
      </Card>
    </main>
  );
}
