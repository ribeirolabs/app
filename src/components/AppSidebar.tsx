import { translations } from "@/app.config";
import { trpc } from "@/utils/trpc";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { useEvent } from "@ribeirolabs/events/react";
import { signOut } from "next-auth/react";
import { PropsWithChildren, useCallback, useState } from "react";

export const AppSidebar = ({ children }: PropsWithChildren) => {
  const [opened, setOpened] = useState(false);

  const session = trpc.useQuery(["auth.getSession"]);

  const user = session.data?.user;

  useEvent(
    "sidebar",
    useCallback(({ detail }) => {
      setOpened(detail === "open");
    }, [])
  );

  if (user == null) {
    return null;
  }

  return (
    <>
      <div
        className="app-sidebar-backdrop"
        data-opened={opened}
        onClick={() => setOpened(false)}
      ></div>
      <aside className="app-sidebar" data-opened={opened}>
        <div className="flex items-center justify-between px-4 pt-4 gap-2">
          <div className="flex-1 truncate">
            <div>{user.name}</div>
          </div>
          <div className="flex-0">
            <button
              className="btn btn-sm gap-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {translations?.sign_out ?? "Log out"}
            </button>
          </div>
        </div>
        <div className="my-4 border-t border-base-300"></div>
        <ul className="menu m-0 p-0 not-prose text-sm">{children}</ul>
      </aside>
    </>
  );
};

export const openSidebar = () => dispatchCustomEvent("sidebar", "open");
export const closeSidebar = () => dispatchCustomEvent("sidebar", "close");
