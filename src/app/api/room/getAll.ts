"use server";

import createServerAction from "@/app/api/createServerActions";
import { Room, RoomTipo } from "@/lib/types/Room";
import axiosFetcher from "../axiosFetcher";

interface GetAllRoomsProps {
  filters?: {
    room_type?: RoomTipo;
  };
}

export async function getAllRooms(params?: GetAllRoomsProps) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.get<Room[]>("/room", {
      params: params
        ? {
            room_type: params.filters?.room_type,
          }
        : undefined,
    });
    return data;
  }, "get-all-room");
}
