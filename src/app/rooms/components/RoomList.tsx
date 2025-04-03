"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
import { Room } from "@/lib/types/Room";

const roomTypes = ["Suite", "Deluxe"];

const statusColors = {
  OCUPADO: "bg-red-500",
  DISPONIVEL: "bg-green-500",
  MANUTENCAO: "bg-amber-500",
  RESERVADO: "bg-blue-500",
  LIMPEZA: "bg-purple-500",
};

interface RoomListProps {
  rooms: Room[];
}

export function RoomList({ rooms: roomsProp }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>(roomsProp);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredRooms = rooms.filter((room) => room);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos</SelectItem>
              <SelectItem value="OCUPADO">Ocupado</SelectItem>
              <SelectItem value="DISPONIVEL">Disponivel</SelectItem>
              <SelectItem value="MANUTENÇÃO">Manutenção</SelectItem>
              <SelectItem value="RESERVADO">Reservado</SelectItem>
              <SelectItem value="LIMPEZA">Limpeza</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todos</SelectItem>
              {roomTypes.map((type) => (
                <SelectItem key={type} value={type.toUpperCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Quarto #</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Andar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente Atual</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-semibold">{room.numero}</TableCell>
                <TableCell className="capitalize">
                  {room.tipo.toLowerCase()}
                </TableCell>
                <TableCell>{(room.numero / 100).toFixed(0)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        statusColors[room.status]
                      }`}
                    />
                    <span className="capitalize">
                      {room.status.toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{"—"}</TableCell>
                <TableCell>{"—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="font-bold">
                        Ações
                      </DropdownMenuLabel>
                      <DropdownMenuItem>Editar Quarto</DropdownMenuItem>

                      <DropdownMenuItem>Mudar Status</DropdownMenuItem>
                      {room.status === "OCUPADO" && (
                        <DropdownMenuItem>Check Out</DropdownMenuItem>
                      )}
                      {room.status === "DISPONIVEL" && (
                        <DropdownMenuItem>Check In</DropdownMenuItem>
                      )}
                      {room.status === "MANUTENCAO" && (
                        <DropdownMenuItem>
                          Marcar como disponível
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
