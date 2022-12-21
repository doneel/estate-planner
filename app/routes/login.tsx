import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";
import { StytchLogin } from "@stytch/nextjs";
import type { StytchError, StytchEvent } from "@stytch/vanilla-js";
import { OAuthProviders, OneTapPositions } from "@stytch/vanilla-js";
import { Products } from "@stytch/vanilla-js";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  /* Stytch auth */
  const stytchProps = {
    config: {
      products: [Products.emailMagicLinks, Products.oauth],
      oauthOptions: {
        loginRedirectURL: "http://localhost:3000/authenticate",
        signupRedirectURL: "http://localhost:3000/authenticate",
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
        loginRedirectURL: "http://localhost:3000/authenticate",
        loginExpirationMinutes: 30,
        signupRedirectURL: "http://localhost:3000/authenticate",
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
