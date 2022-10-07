import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, MenuIcon } from "@common/components/Icons";
import { appName, translations } from "@/app.config";
import { useIsFetching } from "react-query";
import { dispatchCustomEvent } from "@ribeirolabs/events";

export const HeaderBase = ({ children }: PropsWithChildren) => {
  return (
    <header className="print:hidden not-prose navbar bg-base-300 sticky top-0 z-50">
      <div className="w-content flex justify-between gap-2">{children}</div>
    </header>
  );
};

export const AppHeader = () => {
  return (
    <HeaderBase>
      <HeaderLogo appName={appName} />
      <button
        className="lg:hidden btn btn-circle btn-ghost"
        onClick={() => dispatchCustomEvent("sidebar", "open")}
      >
        <MenuIcon size={22} />
      </button>
    </HeaderBase>
  );
};

export function HeaderLogo({ appName }: { appName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();

  useEffect(() => {
    function onStart() {
      setLoading(true);
    }

    function onComplete() {
      setLoading(false);
    }

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);

    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
    };
  }, []);

  return (
    <div className="flex-0 items-baseline">
      <span className="hidden lg:inline-block">ribeirolabs</span>
      <span className="lg:hidden">r</span>
      <span className="mx-1">/</span>
      <Link href="/">
        <a className="text-primary font-bold normal-case">
          <span>{appName.toLowerCase()}</span>
        </a>
      </Link>
      <button
        className={`btn btn-ghost text-primary btn-xs ${
          loading || isFetching ? "opacity-1" : "opacity-0"
        }`}
        data-loading={true}
      >
        &nbsp;
      </button>
    </div>
  );
}

export function HeaderUser() {
  const session = trpc.useQuery(["auth.getSession"]);

  const user = session.data?.user;

  const initials = useMemo(() => {
    if (!user) {
      return "";
    }

    const parts = user.name?.split(" ") ?? [];

    return [parts[0]?.[0] ?? "", parts.at(-1)?.[0] ?? ""].join("");
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost gap-2 btn-sm">
        <span className="hidden lg:inline-block">{user.name}</span>
        <span className="lg:hidden">{initials}</span>
        <ChevronDownIcon />
      </button>

      <ul
        tabIndex={0}
        className="w-content mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
      >
        <li>
          <button onClick={() => signOut({ callbackUrl: "/" })}>
            {translations?.sign_out ?? "Sign out"}
          </button>
        </li>
      </ul>
    </div>
  );
}
