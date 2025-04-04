"use server";

import { revalidatePath } from "next/cache";

export async function revalidateServerData(pathname: string) {
  revalidatePath(pathname);
  return;
}
