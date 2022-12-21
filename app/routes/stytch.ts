import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Response, json } from "@remix-run/node";
import type { Client } from "stytch";

import { getOrCreateStytchUser } from "~/models/user.server";
import { stytchClient } from "~/stytch.server";

export type AuthResults = {
  userId: string;
  sessionToken: string;
  providerValues: { idToken: string };
};

export async function loader({ request, params }: LoaderArgs) {
  let { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token === null) {
    console.error("No token supplied. Authentication will fail.");
    //TODO error notice?
    return redirect("/login");
  }

  const stytch_token_type = searchParams.get("stytch_token_type");
  if (stytch_token_type === null) {
    console.error("No token type supplied. Authentication will fail.");
    //TODO error notice?
    return redirect("/login");
  }

  const client = stytchClient;
  switch (stytch_token_type) {
    case "magic_links":
      console.log("magic linkes login");
      return magicLinkAuth(client, token);
    case "oauth":
      console.log("oauth login");
      return oauthAuth(client, token);
  }
}

function oauthAuth(client: Client, token: string) {
  return client.oauth
    .authenticate(token, { session_duration_minutes: 60 * 8 })
    .then(async (response) => {
      if (response.status_code === 200) {
        const user = await getOrCreateStytchUser(response.user_id);
        return json({
          userId: user.id,
          sessionToken: response.session_token,
          providerValues: response.provider_values,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      throw new Response(`Error authenticating user ${err}`, { status: 500 });
    });
}

function magicLinkAuth(client: Client, token: string) {
  return client.magicLinks
    .authenticate(token ?? "", { session_duration_minutes: 60 * 8 })
    .then(async (response) => {
      if (response.status_code === 200) {
        const email = response.user.emails.find((e) => e.email)?.email;
        if (email === undefined) {
          console.error(
            "No email found for user, cannot log in",
            response.user
          );
          return new Response("Authentication failed: no email", {
            status: response.status_code,
          });
        }
        const user = await getOrCreateStytchUser(response.user_id, email);
        return json({ userId: user.id, sessionToken: response.session_token });
      } else {
        return new Response("Authentication failed", {
          status: response.status_code,
        });
      }
    })
    .catch((err) => {
      throw new Response(`Error authenticating user ${err}`, { status: 500 });
    });
}
