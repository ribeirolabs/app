import { errors } from "@/app.config";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { createContext, PropsWithChildren, useContext } from "react";

const DEFAULT_ERRORS: Partial<Record<TRPC_ERROR_CODE_KEY, string>> = {
  NOT_FOUND: "Page not found",
  FORBIDDEN: "You don't have access to this page",
};

type ErrorContextValue = {
  code?: TRPC_ERROR_CODE_KEY | null;
};

export const ErrorContext = createContext<ErrorContextValue>({
  code: null,
});

export const ErrorProvider = ({
  children,
  code,
}: PropsWithChildren<{ code: TRPC_ERROR_CODE_KEY }>) => {
  const context = {
    code,
  };

  console.log("Provider", code);

  return (
    <ErrorContext.Provider value={context}>{children}</ErrorContext.Provider>
  );
};

export const ErrorContainer = ({ children }: PropsWithChildren) => {
  const { code } = useContext(ErrorContext);

  console.log("Container", { code });

  if (code == null) {
    return <>{children}</>;
  }

  return (
    <div className="p-4 text-center">
      <h2>{errors[code] ?? DEFAULT_ERRORS[code] ?? code}</h2>
    </div>
  );
};
