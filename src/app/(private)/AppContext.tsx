"use client";

import { createContext, ReactNode, useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { menuItems } from "@/lib/constants/menuItems";
import { usePathname } from "next/navigation";

export type Session = {
  id: number;
  email: string;
};

interface AppProviderProps {
  children: ReactNode;
  session: Session;
}

interface AppContextProps {
  session: Session | null;
}

export const AppContext = createContext<AppContextProps>({
  session: null,
});

const AppProvider = ({ children, session }: AppProviderProps) => {
  const pathname = usePathname();

  return (
    <AppContext.Provider value={{ session }}>
      <div className="flex h-screen w-full">
        <aside className="flex flex-col items-center gap-4 flex-1 min-w-64 max-w-64 border-r p-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/MotelHub.svg" alt="MotelHub" width={174} height={93} />
          </Link>
          <nav className="flex flex-col gap-4 mt-4 w-full">
            {menuItems.map((menu, key) => (
              <Button
                asChild
                disabled={menu.href === pathname}
                key={key}
                variant={menu.bold ? "default" : "ghost"}
                className="justify-start"
                size="sm"
              >
                <Link href={menu.href} className="flex items-center gap-4">
                  <menu.icon />
                  {menu.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useSession = () => {
  const { session } = useContext(AppContext);
  return { session };
};
