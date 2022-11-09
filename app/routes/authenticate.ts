import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createUserSession } from "~/session.server";
import type { AuthResults } from "./stytch";

export async function loader({ request, context, params }: LoaderArgs) {
  let { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return redirect("/login");
  }
  try {
    const params = new URLSearchParams([["token", token]]);
    const response = await fetch(
      new URL(`http://localhost:3000/stytch?${params}`)
    );
    if (response.ok) {
      const data: AuthResults = await response.json();
      return createUserSession({
        request,
        userId: data.userId,
        sessionToken: data.sessionToken,
        remember: true,
        redirectTo: "/plan",
      });
    } else {
      return redirect("/login");
    }
  } catch (err) {
    console.error("Error authenticating", err);
    return redirect("/login");
  }
}
