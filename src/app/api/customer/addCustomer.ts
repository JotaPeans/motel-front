"use server";

import createServerAction from "@/app/api/createServerActions";
import { Customer } from "@/lib/types/Customer";
import axiosFetcher from "../axiosFetcher";

export async function addCustomer(customer: Customer) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.post<Customer>("/customer", customer);
    return data;
  }, "add-customers");
}
