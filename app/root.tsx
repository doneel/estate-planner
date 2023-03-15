import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { createStytchUIClient } from "@stytch/nextjs/ui";
import { StytchProvider } from "@stytch/nextjs";
import { Fullstory } from "./components/utils/fullstory";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    },
    {
      rel: "stylesheet",
      href: "/styles/map-styles.css",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/ol-contextmenu@latest/dist/ol-contextmenu.css",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Arda",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    ENV: {
      STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN || "",
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const stytch = createStytchUIClient(data.ENV.STYTCH_PUBLIC_TOKEN);
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <Fullstory />
      </head>
      <body className="h-full">
        <StytchProvider stytch={stytch}>
          <Outlet />
        </StytchProvider>
        <ScrollRestoration />
        <Scripts />
        <script src="https://unpkg.com/flowbite@1.5.3/dist/flowbite.js"></script>
        <LiveReload />
      </body>
    </html>
  );
}
