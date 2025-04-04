"use server";

import createServerAction from "@/app/api/createServerActions";
import { Customer } from "@/lib/types/Customer";
import axiosFetcher from "../axiosFetcher";

export async function getAllCustomers(nome?: string) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Customer[]>('/customer', {
      params: {
        nome
      }
    });
    return data;
  }, "get-all-customers");
}
