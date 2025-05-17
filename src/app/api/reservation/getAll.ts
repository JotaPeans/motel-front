"use server";

import createServerAction from "@/app/api/createServerActions";
import { Reservation } from "@/lib/types/Reservation";
import axiosFetcher from "../axiosFetcher";

export async function getAllReservations() {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Reservation[]>('/reserva');
    return data;
  }, "get-all-reservation");
}
