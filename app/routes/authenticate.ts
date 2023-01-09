import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createUserSession } from "~/session.server";
import type { AuthResults } from "./stytch";

export async function loader({ request, context, params }: LoaderArgs) {
  let { searchParams } = new URL(request.url);

  const token = searchParams.get("token");
  const stytch_token_type = searchParams.get("stytch_token_type");
  if (!token || !stytch_token_type) {
    return redirect("/login");
  }
  try {
    const params = new URLSearchParams([
      ["token", token],
      ["stytch_token_type", stytch_token_type],
    ]);
    const response = await fetch(
      new URL(`http://localhost:3000/stytch?${params}`)
    );
    if (response.ok) {
      const data: AuthResults = await response.json();
      /*
      STORE THE ID_TOKEN
      */
      return createUserSession({
        request,
        userId: data.userId,
        sessionToken: data.sessionToken,
        remember: true,
        providerValues: data.providerValues,
        redirectTo: "/adjusting/claims",
      });
    } else {
      return redirect("/login");
    }
  } catch (err) {
    console.error("Error authenticating", err);
    return redirect("/login");
  }
}
