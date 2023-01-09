import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getOauthProviderValues, getUser, getUserId } from "~/session.server";
import { google } from "googleapis";

export async function loader({ request }: LoaderArgs) {
  const allProviderValues = await getOauthProviderValues(request);
  const user = await getUser(request);

  if (!allProviderValues || !user) return redirect("/");
  const oauth2Client = new google.auth.OAuth2(
    "1046935463743-sr1mkg4jbhehr5lecmclvmp6dd63dvsd.apps.googleusercontent.com",
    "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",
    "https://test.stytch.com/v1/oauth/callback/oauth-callback-test-830878b0-c80a-492a-b33b-d33384d4dcc2"
  );
  oauth2Client.setCredentials({
    access_token: allProviderValues.access_token,
    refresh_token: allProviderValues.refresh_token,
    scope:
      "https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic",
  });
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log("Refreshing credentials");
    }
  });
  google.options({ auth: oauth2Client });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const messages = await gmail.users.messages
    .list({ userId: user?.email })
    .catch((err) => console.error(err));
  const threads = await gmail.users.threads
    .list({ userId: user?.email, q: "from:danieloneel@gmail.com" })
    .catch((err) => console.error(err));
  return json({ messages, threads });
}
