import type { LoaderArgs } from "@remix-run/node";
import { Response } from "@remix-run/node";

import { Client, envs } from "stytch";

export async function loader({ request, params }: LoaderArgs) {
  let { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token === null) {
    console.error("No token supplied. Authentication will fail.");
  }
  const client = new Client({
    project_id: "project-test-28f3f1a5-adca-4cc3-8df2-b0d03979d8cb",
    secret: "secret-test-_SKPJKAPPpNySw_5vHmAyVzG6IqHF2Rmczk=",
    env: envs.test,
  });

  return client.magicLinks
    .authenticate(token ?? "", { session_duration_minutes: 60 * 8 })
    .then((response) => {
      console.log("Stytch response", response);
      if (response.status_code === 200) {
        console.log(response.user);
        //Create or get user
        return new Response("ok", { status: 200 });
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
