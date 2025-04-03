"use server";

import createServerAction from "@/app/api/createServerActions";
import { Room } from "@/lib/types/Room";
import axiosFetcher from "../axiosFetcher";

export async function getAllRooms() {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Room[]>('/room');
    return data;
  }, "get-all-room");
}
