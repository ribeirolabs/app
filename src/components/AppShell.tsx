import { Sidebar } from "@/components/Sidebar";
import { PropsWithChildren } from "react";
import { AppHeader } from "./Header";

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <main className="w-content lg:grid lg:grid-cols-page gap-6 flex-1">
        <div className="grid-span-1 py-4 print:h-full overflow-hidden">
          {children}
        </div>
        <Sidebar />
      </main>
    </div>
  );
};
