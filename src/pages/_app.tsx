import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@/server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@common/components/Toast";
import App, { AppContext } from "next/app";
import { parseCookies } from "nookies";
import { SettingsProvider } from "@common/components/Settings";
import { ErrorPage } from "@common/components/Errors";

const MyApp: AppType = ({
  Component,
  pageProps: { session, settings, error, ...pageProps },
}: any) => {
  return (
    <SessionProvider session={session}>
      <SettingsProvider initial={settings}>
        <ToastProvider>
          <ErrorPage code={error?.code} message={error?.message}>
            <Component {...pageProps} />
          </ErrorPage>
        </ToastProvider>
      </SettingsProvider>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const pageProps = await App.getInitialProps(appContext);

  const settings: AppSettings = JSON.parse(
    parseCookies(appContext.ctx)["@ribeirolabs:settings"] || "{}"
  );

  return {
    pageProps: {
      ...pageProps.pageProps,
      settings,
    },
  };
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        url: "/api/trpc",
        /**
         * @link https://react-query.tanstack.com/reference/QueryClient
         */
        queryClientConfig: {
          defaultOptions: {
            queries: {
              refetchOnMount: false,
              refetchOnReconnect: false,
              refetchOnWindowFocus: false,
              refetchIntervalInBackground: false,
            },
          },
        },
      };
    }
    // during SSR below
    // optional: use SSG-caching for each rendered page (see caching section for more details)
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      "Cache-Control",
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`
    );
    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/trpc`
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
    return {
      transformer: superjson, // optional - adds superjson serialization
      url,
      /**
       * Set custom request headers on every request from tRPC
       * @link http://localhost:3000/docs/v9/header
       * @link http://localhost:3000/docs/v9/ssr
       */
      headers() {
        if (ctx?.req) {
          // To use SSR properly, you need to forward the client's headers to the server
          // This is so you can pass through things like cookies when we're server-side rendering
          // If you're using Node 18, omit the "connection" header
          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            connection: _connection,
            ...headers
          } = ctx.req.headers;
          return {
            ...headers,
            // Optional: inform server that it's an SSR request
            "x-ssr": "1",
          };
        }
        return {};
      },
    };
  },
  ssr: true,
})(MyApp);
