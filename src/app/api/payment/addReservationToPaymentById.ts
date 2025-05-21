"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";

interface CreatePaymentIntentProps {
  id: number;
  reservaId: number;
}

export async function addReservationToPaymentById({
  id,
  reservaId,
}: CreatePaymentIntentProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.patch<string>(`/payment/${id}`, {
      reservaId,
    });
    return data;
  }, "create-point-payment-intent");
}
