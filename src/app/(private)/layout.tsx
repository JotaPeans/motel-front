import { ReactNode } from "react";
import { redirect } from "next/navigation";

import AppProvider from "./AppContext";
import { getServerSession } from "../api/auth/login copy";

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {

  const { data: session } = await getServerSession();

  if (session === null) return redirect("/login");

  return <AppProvider session={session}>{children}</AppProvider>;
};

export default PrivateLayout;
