import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {}

export async function action({ request }: ActionArgs) {
  console.log("USERS ACTION", request, request.body);
}
