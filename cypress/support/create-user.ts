// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { installGlobals } from "@remix-run/node";
import { parse } from "cookie";

import { createStytchUser } from "~/models/user.server";
import { createUserSession } from "~/session.server";

installGlobals();

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const user = await createStytchUser({
    stytchUserId: "fake-user-string",
    email,
    oauthProvider: "Google",
    oauthRefreshToken: "fake-oauth-refresh-token",
  });

  const response = await createUserSession({
    request: new Request("test://test"),
    userId: user.id,
    sessionToken: "fake-session-token",
    remember: false,
    providerValues: {
      access_token: "fake-access-token",
      refresh_token: "fake-refresh-token",
      id_token: "token-id",
      expires_at: new Date(2023, 12, 31).getMilliseconds(),
      scopes: ["fake-scope"],
    },
    redirectTo: "/",
  });

  const cookieValue = response.headers.get("Set-Cookie");
  if (!cookieValue) {
    throw new Error("Cookie missing from createUserSession response");
  }
  const parsedCookie = parse(cookieValue);
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim()
  );
}

createAndLogin(process.argv[2]);
