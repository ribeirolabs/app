import { Sidebar } from "@/components/Sidebar";
import { PropsWithChildren } from "react";
import { AppHeader } from "./Header";

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <main className="w-content md:grid md:grid-cols-page gap-6 flex-1">
        <div className="grid-span-1 p-4 md:px-0 print:h-full">{children}</div>
        <Sidebar />
      </main>
    </div>
  );
};
