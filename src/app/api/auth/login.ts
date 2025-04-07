"use server";

import createServerAction from "@/app/api/createServerActions";
import axiosFetcher from "../axiosFetcher";

export async function login(body: {email: string, password: string}) {
  return await createServerAction(async () => {
    const { data } = await axiosFetcher.post('/login', body);
    return data;
  }, "login");
}
