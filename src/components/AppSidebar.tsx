import { translations } from "@/app.config";
import { trpc } from "@/utils/trpc";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { useEvent } from "@ribeirolabs/events/react";
import { signOut } from "next-auth/react";
import { PropsWithChildren, useCallback, useState } from "react";
import { CloseIcon, LogoutIcon } from "./Icons";

export const AppSidebar = ({ children }: PropsWithChildren) => {
  const [opened, setOpened] = useState(false);

  const session = trpc.useQuery(["auth.getSession"]);

  const user = session.data?.user;

  function close() {
    setOpened(false);
  }

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
        onClick={close}
      ></div>

      <aside className="app-sidebar" data-opened={opened}>
        <div className="flex items-center justify-between px-4 pt-4 gap-2">
          <div className="flex-1 truncate">
            <div>{user.name}</div>
          </div>

          <div className="lg:hidden flex-0">
            <button className="btn btn-circle btn-ghost" onClick={close}>
              <CloseIcon size={24} />
            </button>
          </div>
        </div>
        <div className="my-4 border-t border-base-300"></div>
        <ul className="menu m-0 p-0 not-prose text-sm">
          {children}
          <div className="divider"></div>
          <li>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              <LogoutIcon size={18} />
              {translations?.sign_out ?? "Log out"}
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export const openSidebar = () => dispatchCustomEvent("sidebar", "open");
export const closeSidebar = () => dispatchCustomEvent("sidebar", "close");
