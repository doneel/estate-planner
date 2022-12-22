import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Response, json } from "@remix-run/node";
import type { Client } from "stytch";
import type { ProvidersValues } from "stytch/types/lib/oauth";

import {
  createStytchUser,
  getUserByStytchId,
  updateRefreshToken,
} from "~/models/user.server";
import { stytchClient } from "~/stytch.server";

export type AuthResults = {
  userId: string;
  sessionToken: string;
  providerValues: ProvidersValues;
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
      console.log("magic links login");
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
        const refreshToken = response.provider_values.refresh_token;
        const email = response.user.emails.at(0)?.email;
        if (!refreshToken) {
          console.error("No refresh token. Restart flow."); //TODO
          throw redirect("/login");
        }
        if (!email) {
          console.error("No email. Restart flow."); //TODO
          throw redirect("/login");
        }
        let user = await getUserByStytchId(response.user_id);
        if (user) {
          /* If a refresh token is provided for some unexpected reason, save it anyways */
          if (response.provider_values.refresh_token) {
            console.log("Unexpectedly saving refresh token on login");
            updateRefreshToken(user.id, response.provider_values.refresh_token);
          }
        } else {
          user = await createStytchUser({
            stytchUserId: response.user_id,
            oauthProvider: response.provider_type,
            oauthRefreshToken: refreshToken,
            email,
          });
        }
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
  /* Not supported- requiring OAuth at present */
  return redirect("/login");
  /*
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
        const user = await createStytchUser(response.user_id, email);
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
    */
}
