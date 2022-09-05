import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { Header } from "@/components/Header";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { errors } from "@/app.config";
import { ErrorContainer } from "./Error";

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const session = trpc.useQuery(["auth.getSession"]);
  const router = useRouter();

  useEffect(() => {
    if (session.data == null && session.status === "success") {
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );

      router.push("/auth/signin?callbackUrl=" + callbackUrl);
    }
  }, [session, router]);

  if (session.data == null) {
    return null;
  }

  return (
    <>
      <Header />

      <ErrorContainer>
        <main className="p-4">{children}</main>
      </ErrorContainer>
    </>
  );
};
