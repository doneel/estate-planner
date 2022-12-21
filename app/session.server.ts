import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { OAuthProviders } from "@stytch/vanilla-js";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { stytchClient } from "./stytch.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";
const STYTCH_SESSION_TOKEN_KEY = "stytch_session_token";
const OAUTH_ID_TOKEN = "oauth_id_token";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

async function authenticateSession(session: Session): Promise<boolean> {
  try {
    const stytchResults = await stytchClient.sessions.authenticate({
      session_token: session.get(STYTCH_SESSION_TOKEN_KEY),
      session_duration_minutes: 60 * 8,
    });

    if (stytchResults.status_code !== 200) {
      /* Session did not authenticate */
      return false;
    }
  } catch (err: any) {
    if (err.status_code != 404) {
      /* Swallow expected case of no session found */
      console.error("Session error on stytch", err);
    }
    /* Session did not authenticate */
    return false;
  }
  return true;
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  const sessionIsLive = await authenticateSession(session);
  if (sessionIsLive) {
    return userId;
  } else {
    return undefined;
  }
}

export async function getOauthProviderToken(request: Request) {
  const session = await getSession(request);
  const oauthProviderToken = session.get(OAUTH_ID_TOKEN);
  const sessionIsLive = await authenticateSession(session);
  if (sessionIsLive) {
    return oauthProviderToken;
  } else {
    return undefined;
  }
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  sessionToken,
  remember,
  idToken,
  redirectTo,
}: {
  request: Request;
  userId: string;
  sessionToken: string;
  remember: boolean;
  idToken: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(STYTCH_SESSION_TOKEN_KEY, sessionToken);
  session.set(OAUTH_ID_TOKEN, idToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  await stytchClient.sessions.revoke({
    session_token: session.get(STYTCH_SESSION_TOKEN_KEY),
  });
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
