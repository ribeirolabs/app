import superjson from "superjson";
import { prisma } from "@/server/db/client";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/server/router";
import { authOptions } from "@common/pages/auth/nextauth";
import { Session, unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { TRPC_ERROR_TO_HTTP_STATUS } from "@common/components/Errors";

type Props = Record<string, any>;

export const ssp = async (
  ctx: GetServerSidePropsContext,
  cb: (
    srr: ReturnType<typeof createSSGHelpers<typeof appRouter>>,
    session: Session | null
  ) => Promise<any> | Promise<any>[]
): Promise<GetServerSidePropsResult<Props>> => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  const ssr = createSSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      // @ts-ignore
      req: ctx.req,
      session: session,
      prisma: prisma,
    },
  });

  let error: {
    code: TRPC_ERROR_CODE_KEY;
    message?: string;
    cause?: string;
  } | null = null;

  try {
    await Promise.all([
      ssr.fetchQuery("auth.getSession"),
      ssr.fetchQuery("user.me"),
    ]);

    await Promise.all(([] as Promise<any>[]).concat(cb(ssr, session)));
  } catch (e: any) {
    const errorCode: TRPC_ERROR_CODE_KEY = e.code;

    error = {
      code: errorCode,
      message: e.message,
    };

    if (errorCode === "UNAUTHORIZED") {
      return {
        redirect: {
          permanent: false,
          destination: `/auth/signin?callbackUrl${encodeURIComponent(
            ctx.resolvedUrl
          )}`,
        },
      };
    }

    ctx.res.statusCode = TRPC_ERROR_TO_HTTP_STATUS[errorCode!];
  }

  return {
    props: {
      trpcState: ssr.dehydrate(),
      error,
    },
  };
};
