import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

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
    console.log("response from my stytch endpoint", response);
    if (response.ok) {
      return redirect("/plan");
    } else {
      return redirect("/login");
    }
  } catch (err) {
    console.error("Error authenticating", err);
    return redirect("/login");
  }
}

export async function action({ request }: ActionArgs) {
  console.log("USERS ACTION", request, request.body);
}
