import { Sidebar } from "@/components/Sidebar";
import { getUserDisplayName } from "@/utils/account";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { AppHeader } from "./Header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <main className="w-content lg:grid lg:grid-cols-page gap-6 flex-1">
        <div className="grid-span-1 py-4 print:h-full overflow-hidden">
          <PendingAccountTransfers />
          {children}
        </div>
        <Sidebar />
      </main>
    </div>
  );
}

function PendingAccountTransfers() {
  const user = trpc.useContext().getQueryData(["user.me"]);

  if (!user || !user.pendingTransfer) {
    return null;
  }

  return (
    <div className="not-prose mb-4 print:hidden">
      <div key={user.pendingTransfer.id} className="alert bg-warning/10">
        <span className="flex-col items-center md:items-start text-center">
          {user.pendingTransfer.isOwner && (
            <div className="badge bg-black/50 border-0 flex-shrink-0">
              Account Locked
            </div>
          )}

          <div className="text-center md:text-start">
            Pending transfer account request{" "}
            {user.pendingTransfer.isOwner ? "to " : "from "}
            <span className="text-highlight break-words whitespace whitespace-normal">
              {user.pendingTransfer.isOwner
                ? getUserDisplayName(
                    user.pendingTransfer.toUserEmail,
                    user.pendingTransfer.toUser
                  )
                : getUserDisplayName(
                    user.pendingTransfer.fromUserEmail,
                    user.pendingTransfer.fromUser
                  )}
            </span>
          </div>
        </span>

        <Link href={`/settings/transfer-account/${user.pendingTransfer.id}`}>
          <a className="flex-1 md:flex-none btn btn-sm btn-warning md:btn-wide btn-bordered">
            View
          </a>
        </Link>
      </div>

      <div className="divider"></div>
    </div>
  );
}
