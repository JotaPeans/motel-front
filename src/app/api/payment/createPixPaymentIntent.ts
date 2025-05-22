"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { getRoomById } from "../room/getById";
import { Customer } from "@/lib/types/Customer";
import { addCustomer } from "../customer/addCustomer";

interface CreatePaymentIntent {
  roomId: number;
  customer: Customer;
}

export interface PixOrder {
  id: string;
  code: string;
  image_b64: string;
}

export async function createPixPaymentIntent({
  roomId,
  customer
}: CreatePaymentIntent) {
  return await createServerAction(async () => {
    const { data: room, error } = await getRoomById(roomId);

    if (customer.id === 0) {
      const { data } = await addCustomer(customer);

      if (data) customer.id = data.id;
      else throw new Error("Erro ao criar o cliente");
    }

    if (error || room === null)
      throw new Error(error?.message || "Quarto nao encontrado");

    const { data } = await axiosFetcher.post<PixOrder>("/payment/provider/pix", {
      amount: room.valor,
      customer_id: customer.id,
      customer_email: customer.email,
      customer_name: customer.nome,
    });
    return data;
  }, "create-pix-payment-intent");
}
