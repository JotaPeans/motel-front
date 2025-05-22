"use server";

import createServerAction from "@/app/api/createServerActions";
import { Customer } from "@/lib/types/Customer";
import axiosFetcher from "../axiosFetcher";

interface GetAllCustomersProps {
  nome?: string;
  page?: number;
  size?: number;
}

export async function getAllCustomers(params?: GetAllCustomersProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Customer[]>('/customer', {
      params: params ? {
        ...params
      } : undefined
    });
    return data;
  }, "get-all-customers");
}
