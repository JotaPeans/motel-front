"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { getRoomById } from "../room/getById";
import { Customer } from "@/lib/types/Customer";
import { addCustomer } from "../customer/addCustomer";

interface CreatePaymentIntentProps {
  method: "debit" | "credit";
  roomId: number;
  customer: Customer;
}

export interface PointOrder {
  id: string;
  amount: number;
  method: "debit" | "credit";
}

export async function createPointPaymentIntent({
  method,
  roomId,
  customer
}: CreatePaymentIntentProps) {
  return await createServerAction(async () => {
    const { data: room, error } = await getRoomById(roomId);

    if (customer.id === 0) {
      const { data } = await addCustomer(customer);

      if (data) customer.id = data.id;
      else throw new Error("Erro ao criar o cliente");
    }

    if (error || room === null)
      throw new Error(error?.message || "Quarto nao encontrado");

    const url = `/payment/provider/${method}`;
    console.log("🚀 ~ returnawaitcreateServerAction ~ url:", url)
    const { data } = await axiosFetcher.post<PointOrder>(
      url,
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
