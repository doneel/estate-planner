import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";
import { StytchLogin } from "@stytch/nextjs";
import type { StytchError, StytchEvent } from "@stytch/vanilla-js";
import { OAuthProviders, OneTapPositions } from "@stytch/vanilla-js";
import { Products } from "@stytch/vanilla-js";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/adjusting");
  return json({
    ENV: {
      BASE_URL: process.env.BASE_URL,
    },
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  /* Stytch auth */
  const stytchProps = {
    config: {
      products: [Products.oauth],
      oauthOptions: {
        loginRedirectURL: `${data.ENV.BASE_URL}/authenticate`,
        signupRedirectURL: `${data.ENV.BASE_URL}/authenticate`,
        providers: [
          /*
          {
            one_tap: true,
            type: OAuthProviders.Google,
            position: OneTapPositions.floating,
            custom_scopes: [
              "https://mail.google.com/",
              "https://www.googleapis.com/auth/gmail.modify",
              "https://www.googleapis.com/auth/gmail.readonly",
              "https://www.googleapis.com/auth/gmail.settings.basic",
            ],
          },
          */
          {
            type: OAuthProviders.Google,
            custom_scopes: [
              "https://mail.google.com/",
              "https://www.googleapis.com/auth/gmail.modify",
              "https://www.googleapis.com/auth/gmail.readonly",
              "https://www.googleapis.com/auth/gmail.settings.basic",
            ],
          },
        ],
      },
      emailMagicLinksOptions: {
        loginRedirectURL: `${data.ENV.BASE_URL}/authenticate`,
        loginExpirationMinutes: 30,
        signupRedirectURL: `${data.ENV.BASE_URL}/authenticate`,
        signupExpirationMinutes: 30,
        createUserAsPending: true,
      },
    },
    styles: {
      //fontFamily: '"Helvetica New", Helvetica, sans-serif',
      //width: "321px",
      primaryColor: "#3B82F6",
      container: {
        borderColor: "#f3f4f6",
      },
      buttons: {
        primary: {
          backgroundColor: "#3B82F6",
        },
      },
    },
    callbacks: {
      onEvent: (message: StytchEvent) => console.log("onEvent", message),
      onSuccess: (message: StytchEvent) => console.log("onSuccess", message),
      onError: (message: StytchError) => console.log("onError", message),
    },
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto place-self-center pb-32 lg:col-span-7">
        <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
          Claims Management
        </h1>
        <div className="align-center mb-1 flex gap-x-2">
          <h4 className="max-w-2xl text-xl font-bold leading-none">
            Private Demo
          </h4>
          <span className="my-auto rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
            Active
          </span>
        </div>
        <h4 className="max-w-2xl text-xl leading-none">
          Release{" "}
          <span className="font-mono text-base">
            39491bece9838834ce3f53c09b2df0760fdcd668
          </span>
        </h4>
      </div>
      <div className="mx-auto w-full max-w-md px-8">
        <StytchLogin
          config={stytchProps.config}
          styles={stytchProps.styles}
          callbacks={stytchProps.callbacks}
        />
      </div>
    </div>
  );
}
