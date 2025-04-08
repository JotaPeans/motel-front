"use server";

import createServerAction from "@/app/api/createServerActions";
import { cookies } from "next/headers";
import axiosFetcher from "../axiosFetcher";

export async function login(body: { email: string; password: string }) {
  return await createServerAction(async () => {
    const cookie = await cookies();
    const { data } = await axiosFetcher.post<{ token: string }>(
      "/auth/login",
      body
    );

    if (data) cookie.set("access-token", data.token);

    return data;
  }, "login");
}
