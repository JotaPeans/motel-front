"use server";

import createServerAction from "@/app/api/createServerActions";
import { Room } from "@/lib/types/Room";
import axiosFetcher from "../axiosFetcher";

export async function createRoom(props: Partial<Room>) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.post<Room>('/room', props);
    return data;
  }, "create-room");
}
