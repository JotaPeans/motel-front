"use server";

import createServerAction from "@/app/api/createServerActions";
import { Consumo } from "@/lib/types/Consumo";
import axiosFetcher from "../axiosFetcher";

interface GetAllConsumosProps {
  page?: number;
  size?: number;
  filters?: {
    ano_consumo?: string;
    produto_id?: string | number;
  };
}

export async function getAllConsumos(params?: GetAllConsumosProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Consumo[]>("/consumo", {
      params: params
        ? {
            page: params.page,
            size: params.size,
            ano_consumo: params.filters?.ano_consumo,
            produto_id: params.filters?.produto_id,
          }
        : undefined,
    });
    return data;
  }, "get-all-consumo");
}
