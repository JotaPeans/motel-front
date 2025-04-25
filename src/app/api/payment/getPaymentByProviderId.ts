"use server";

import createServerAction from "@/app/api/createServerActions";
import { Payment } from "@/lib/types/Payment";

import axiosFetcher from "../axiosFetcher";

export async function getPaymentByProviderId(id: string) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Payment>(`/payment/provider/${id}`);
    return data;
  }, "get-payment-by-provider-id");
}
