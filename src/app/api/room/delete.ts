"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";

export async function deleteRoom(id: number) {
  return await createServerAction(async () => {
    await axiosFetcher.delete<void>(`/room/${id}`)
  }, "delete-room");
}
