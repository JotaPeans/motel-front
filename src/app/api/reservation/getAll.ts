"use server";

import createServerAction from "@/app/api/createServerActions";
import { Reservation } from "@/lib/types/Reservation";
import axiosFetcher from "../axiosFetcher";

interface GetAllReservationsProps {
  page?: number;
  size?: number;
}

export async function getAllReservations(params?: GetAllReservationsProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Reservation[]>("/reserva", {
      params: params ? {
        page: params.page,
        size: params.size,
      } : undefined,
    });
    return data;
  }, "get-all-reservation");
}
