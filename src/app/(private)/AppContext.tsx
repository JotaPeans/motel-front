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
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/MotelHub.svg" alt="MotelHub" width={174} height={93} />
          </Link>
          <nav className="ml-auto flex gap-2">
            {menuItems.map((menu, key) => (
              <Button
                asChild
                disabled={menu.href === pathname}
                key={key}
                variant={menu.bold ? "default" : "outline"}
                size="sm"
              >
                <Link href={menu.href}>{menu.label}</Link>
              </Button>
            ))}
          </nav>
        </header>
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
