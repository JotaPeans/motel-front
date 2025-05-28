"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";
import { Product } from "@/lib/types/Product";

interface GetAllProductsProps {
  filter?: {
    name?: string;
  }
}

export async function getAllProducts(params?: GetAllProductsProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Product[]>("/products", {
      params: params?.filter ? {
        name: params.filter.name
      } : undefined,
    });
    return data;
  }, "get-all-products");
}
