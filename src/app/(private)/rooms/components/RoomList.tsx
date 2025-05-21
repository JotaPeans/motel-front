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
import { MoreHorizontal } from "lucide-react";
import { Room, RoomStatus, RoomTipo } from "@/lib/types/Room";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { checkoutReservation } from "@/app/api/reservation/checkout";
import { revalidateServerData } from "@/app/api/revalidateServerData";
import { usePathname } from "next/navigation";
import { useSession } from "../../AppContext";

const roomTypes = ["Suite", "Deluxe"];

const statusColors = {
  OCUPADO: "bg-red-500",
  DISPONIVEL: "bg-green-500",
  MANUTENCAO: "bg-amber-500",
  LIMPEZA: "bg-purple-500",
};

interface RoomListProps {
  rooms: Room[];
}

export function RoomList({ rooms }: RoomListProps) {
  const { session } = useSession();
  const pathname = usePathname();

  const [statusFilter, setStatusFilter] = useState<RoomStatus | null>(null);
  const [typeFilter, setTypeFilter] = useState<RoomTipo | null>(null);

  const filteredRooms = rooms.filter((room) => {
    if (statusFilter || typeFilter) {
      return room.status === statusFilter || room.tipo === typeFilter;
    }

    return room;
  });

  async function onCheckout(reservaId: number) {
    const { data, error } = await checkoutReservation(reservaId);

    toast(
      data
        ? "Checkout realizado com sucesso"
        : error?.message || "Erro ao realizar checkout do quarto!"
    );

    await revalidateServerData(pathname);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter ?? "All"}
            onValueChange={(e) => {
              if (e === "All") {
                setStatusFilter(null);
              } else {
                setStatusFilter(e as RoomStatus);
              }
            }}
          >
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
          <Select
            value={typeFilter ?? "All"}
            onValueChange={(e) => {
              if (e === "All") {
                setTypeFilter(null);
              } else {
                setTypeFilter(e as RoomTipo);
              }
            }}
          >
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
              <TableHead>Preço</TableHead>
              <TableHead>Andar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente Atual</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-semibold">{room.numero}</TableCell>
                <TableCell className="capitalize font-semibold">
                  {room.tipo.toLowerCase()}
                </TableCell>
                <TableCell className="font-semibold">
                  R$ {room.valor.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell className="font-semibold">
                  {(room.numero / 100).toFixed(0)}
                </TableCell>
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
                <TableCell>{room.clienteNome || "-"}</TableCell>
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

                      {room.clienteNome && (
                        <ConfirmDialog
                          title="Checkout da reserva"
                          description="Deseja realizar o checkout da reserva?"
                          onConfirm={async () =>
                            await onCheckout(room.reservaId)
                          }
                        >
                          <button className="focus:bg-accent hover:bg-accent w-full focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                            Check Out
                          </button>
                        </ConfirmDialog>
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
