"use server";

import createServerAction from "@/app/api/createServerActions";

import axiosFetcher from "../axiosFetcher";

export async function getPdvPaymentIntentStatusById(paymentIntentId: string) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<{ status: string }>(
      `/provider/pdv/${paymentIntentId}`
    );
    return data;
  }, "get-pdv-payment-intent-status-by-id");
}
