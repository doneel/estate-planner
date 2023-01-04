import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getOauthProviderValues, getUser, getUserId } from "~/session.server";
import type { gmail_v1 } from "googleapis";
import { google } from "googleapis";
import { useLoaderData } from "@remix-run/react";
import { gmailpostmastertools } from "googleapis/build/src/apis/gmailpostmastertools";

export async function loader({ request }: LoaderArgs) {
  if (true) {
    return { messages: [], threads: [] };
  }
  /*
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
  const threadList = await gmail.users.threads
    .list({ userId: user?.email, q: "from:johnziegler4@gmail.com" })
    .catch((err) => console.error(err));

  const threadPromises = threadList?.data.threads
    ?.map((thread) => thread.id)
    .filter<string>((id): id is string => id !== undefined && id !== null)
    .map((id) => gmail.users.threads.get({ id, userId: user?.email }));
  //.map(async (result) => await result);
  const threads = await Promise.all(threadPromises ?? []);
  threads
    ?.map((t) => t.data)
    .map(lastMessage)
    .flatMap((t) => t?.payload?.headers)
    ?.forEach(console.log);
  return json({ messages, threads: threads });
  */
}

function lastMessage(thread: gmail_v1.Schema$Thread) {
  return thread.messages?.at(-1);
}

export default function Email() {
  const { messages, threads } = useLoaderData<typeof loader>();
  return (
    <div className="flex w-full p-4">
      <div className="w-1/2">
        <ol className="mx-1 w-full">
          {threads?.map((thread) => (
            <li key={thread.data.id} className="w-full border bg-white p-2">
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="mr-2 ">
                      {lastMessage(thread.data)?.payload?.headers?.find(
                        (h) => h.name === "From"
                      )?.value ?? "<Unknown Sender>"}
                    </div>
                    <span className="my-auto rounded bg-gray-100 px-2.5 py-0.5 text-sm font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
                      {thread.data.messages?.length}
                    </span>
                  </div>
                  <div className=" font-light">
                    {new Date(
                      Number(lastMessage(thread.data)?.internalDate) ?? -1
                    ).toLocaleString() ?? ""}
                  </div>
                </div>
                <div className="mr-2  overflow-hidden text-ellipsis  font-semibold">
                  {lastMessage(thread.data)?.payload?.headers?.find(
                    (h) => h.name === "Subject"
                  )?.value ?? "(No Subject)"}
                </div>
                <div className="max-h-[1em] overflow-hidden text-ellipsis text-sm">
                  {lastMessage(thread.data)?.snippet}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
