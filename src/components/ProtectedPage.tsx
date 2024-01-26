import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppShell } from "./AppShell";

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const session = trpc.useQuery(["auth.getSession"]);
  const router = useRouter();

  useEffect(() => {
    console.log("session", session);

    if (session.data == null && session.status === "success") {
      console.error("Redirecting to login, no valid session", session);
      router.push("/auth/signin");
    }
  }, [session]);

  if (session.data == null) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <>
      <h1>Something went wrong</h1>
      <pre>{error.stack}</pre>
    </>
  );
}
