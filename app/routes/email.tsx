import { getOauthProviderToken, getUserId } from "~/session.server";

export async function loader({ request }: Loader) {
  const oauthUserToken = await getOauthProviderToken(request);

  if (oauthUserToken) return redirect("/");
}
