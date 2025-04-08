"use server";

import createServerAction from "@/app/api/createServerActions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import axiosFetcher from "../axiosFetcher";
import { Session } from "@/app/(private)/AppContext";

function getTokenData(token: string): Session | null {
  try {
    const data = jwt.decode(token);
    if (data === null) return null;

    return {
      id: (data as any).id,
      email: data.sub as string,
    };
  } catch (error) {
    return null;
  }
}

export async function getServerSession() {
  return await createServerAction(async () => {
    const cookie = await cookies();
    const accessToken = cookie.get("access-token");

    return getTokenData(accessToken?.value || "");
  }, "login");
}
