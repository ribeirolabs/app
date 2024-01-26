import { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { appName, auth, translations } from "@/app.config";

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}

export default function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <h2 className="font-brand">ribeirolabs / {appName}</h2>
      {Object.values(providers ?? {}).map((provider) => (
        <button
          key={provider.name}
          className="btn btn-lg btn-primary"
          onClick={() =>
            signIn(
              provider.id,
              {
                callbackUrl: "/",
              },
              {
                scope: [
                  "openid",
                  "https://www.googleapis.com/auth/userinfo.email",
                  "https://www.googleapis.com/auth/userinfo.profile",
                ]
                  .concat(auth?.scopes ?? [])
                  .join(" "),
              }
            )
          }
        >
          {translations?.sign_in ?? "Sign in with"} {provider.name}
        </button>
      ))}
    </div>
  );
}
