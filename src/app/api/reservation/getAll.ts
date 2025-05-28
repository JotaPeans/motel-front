"use server";

import createServerAction from "@/app/api/createServerActions";
import { Reservation } from "@/lib/types/Reservation";
import axiosFetcher from "../axiosFetcher";
import { RoomTipo } from "@/lib/types/Room";

interface GetAllReservationsProps {
  page?: number;
  size?: number;
  filters?: {
    ano_reserva?: string;
    room_type?: RoomTipo;
  };
}

export async function getAllReservations(params?: GetAllReservationsProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Reservation[]>("/reserva", {
      params: params
        ? {
            page: params.page,
            size: params.size,
            ano_reserva: params.filters?.ano_reserva,
            room_type: params.filters?.room_type,
          }
        : undefined,
    });
    return data;
  }, "get-all-reservation");
}
