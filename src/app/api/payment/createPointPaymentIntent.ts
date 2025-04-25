"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { getRoomById } from "../room/getById";
import { Customer } from "@/lib/types/Customer";

interface CreatePaymentIntentProps {
  method: "debit" | "credit";
  roomId: number;
  customer: Customer;
}

interface PointOrder {
  id: string;
}

export async function createPointPaymentIntent({
  method,
  roomId,
  customer
}: CreatePaymentIntentProps) {
  return await createServerAction(async () => {
    const { data: room, error } = await getRoomById(roomId);

    if (customer.id === 0) {
      const { data } = await axiosFetcher.post<Customer>("/customer", customer);

      if (data) customer.id = data.id;
      else throw new Error("Erro ao criar o cliente");
    }

    if (error || room === null)
      throw new Error(error?.message || "Quarto nao encontrado");

    const { data } = await axiosFetcher.post<PointOrder>(
      `/payment/provider/${method}`,
      {
        amount: room.valor,
        customer_id: customer.id,
        customer_email: customer.email,
        customer_name: customer.nome,
      }
    );
    return data;
  }, "create-point-payment-intent");
}
