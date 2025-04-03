"use server";

import createServerAction from "@/app/api/createServerActions";
import { Room } from "@/lib/types/Room";
import axiosFetcher from "../axiosFetcher";

export async function updateRoom(id: number, props: Partial<Room>) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.put<Room>(`/room/${id}`, props);
    return data;
  }, "update-room");
}
