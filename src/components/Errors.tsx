import Link from "next/link";
import { errors, translations } from "@/app.config";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { PropsWithChildren } from "react";
import { AppHeader } from "./Header";
import { invert } from "@common/utils/invert";
import { ArrowLeftIcon, LockIcon, WarningIcon } from "./Icons";

const BackHomepage = () => (
  <Link href="/">
    <a className="btn btn-secondary btn-wide gap-2">
      <ArrowLeftIcon size={20} />
      {translations.back_homepage}
    </a>
  </Link>
);

const Container = ({ children }: PropsWithChildren) => (
  <>
    <AppHeader>
      <div className="flex flex-1 justify-center"></div>
    </AppHeader>
    <div className="p-8 w-content text-center">{children}</div>
  </>
);

export const GenericError = () => {
  return (
    <Container>
      <h1>Something went wrong!</h1>

      <BackHomepage />
    </Container>
  );
};

export const ForbiddenError = ({ resource }: { resource: string }) => {
  return (
    <Container>
      <h1>Hold on!</h1>
      <h2>You do not have access to this {resource}.</h2>

      <BackHomepage />
    </Container>
  );
};

const DEFAULT_ERRORS: Partial<Record<TRPC_ERROR_CODE_KEY, string>> = {
  NOT_FOUND: "Page not found",
  FORBIDDEN: "You don't have access to this page",
  INTERNAL_SERVER_ERROR: "Something went wrong",
};

export const ErrorPage = ({
  children,
  code,
}: PropsWithChildren<{ code?: TRPC_ERROR_CODE_KEY | null }>) => {
  if (code == null) {
    return <>{children}</>;
  }

  return (
    <Container>
      <div className="text-center text-8xl mb-8">
        {code === "FORBIDDEN" ? <LockIcon /> : <WarningIcon />}
      </div>

      <h1 className="align-middle">
        {errors[code] ?? DEFAULT_ERRORS[code] ?? code}
      </h1>

      <BackHomepage />
    </Container>
  );
};

export const HTTP_STATUS_TO_TRPC_ERROR: Record<number, TRPC_ERROR_CODE_KEY> = {
  400: "BAD_REQUEST",
  500: "INTERNAL_SERVER_ERROR",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_SUPPORTED",
  408: "TIMEOUT",
  409: "CONFLICT",
  412: "PRECONDITION_FAILED",
  413: "PAYLOAD_TOO_LARGE",
  499: "CLIENT_CLOSED_REQUEST",
};

export const TRPC_ERROR_TO_HTTP_STATUS = invert(HTTP_STATUS_TO_TRPC_ERROR);
