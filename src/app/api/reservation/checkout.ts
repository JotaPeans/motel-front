"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { Customer } from "@/lib/types/Customer";

interface CreateReservationProps {
  cliente: Customer;
  quartoId: number;
  funcionarioId: number;
}

export async function checkoutReservation(reservaId: number | string) {
  return await createServerAction(async () => {
    await axiosFetcher.patch(`/reserva/checkout/${reservaId}`);

    return "success";
  }, "create-reservation");
}
