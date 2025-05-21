"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";

interface CreatePaymentIntentProps {
  paymentIntentId: string;
}

export async function cancelPointPaymentIntent({
  paymentIntentId,
}: CreatePaymentIntentProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.delete<{ id: string }>(
      `/payment/provider/pdv/${paymentIntentId}`
    );
    return data;
  }, "create-point-payment-intent");
}
