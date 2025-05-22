"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { Reservation } from "@/lib/types/Reservation";
import { Customer } from "@/lib/types/Customer";
import { addCustomer } from "../customer/addCustomer";

interface CreateReservationProps {
  cliente: Customer;
  quartoId: number;
  funcionarioId: number;
}

export async function createReservation(body: CreateReservationProps) {
  return await createServerAction(async () => {
    const { cliente, quartoId, funcionarioId } = body;

    if (cliente.id === 0) {
      const { data } = await addCustomer(cliente);

      if (data) cliente.id = data.id;
    }

    if(cliente.id) {
      const { data } = await axiosFetcher.post<Reservation>("/reserva", {
        clienteId: cliente.id,
        quartoId: quartoId,
        funcionarioId: funcionarioId,
      });
      return data;
    }
    
    throw new Error("Erro ao criar o usuário");
  }, "create-reservation");
}
