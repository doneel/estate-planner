import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ClaimInfoCard from "~/components/claims/ClaimInfoCard";
import { getClaimById } from "~/models/claim.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const claimId = params.claimId;
  invariant(claimId, "Claim does not exist.");
  const claim = await getClaimById(claimId);
  return json({ claim });
}

export default function ClaimPage() {
  const data = useLoaderData<typeof loader>();
  const claim = data.claim;
  if (claim === null) {
    return (
      <div>
        <h1 className="text-2xl">Claim couldn't be found.</h1>
      </div>
    );
  }
  return (
    <div className="h-full w-full">
      <header className="w-full">
        <div className="w-full border-x border-t bg-white py-4 px-8">
          <ClaimInfoCard claim={claim} size={"lg"} />
        </div>
      </header>

      <div className="w-full border-b border-gray-200 bg-white text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex w-full flex-wrap justify-center">
          <li className="mr-2">
            <NavLink
              to="info"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Info
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="activity"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Activity
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="email"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Email
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="messaging"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Messaging
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="time"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Time & Expense
            </NavLink>
          </li>
          <li className="mr-2">
            <NavLink
              to="reports"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "       border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                } inline-block rounded-t-lg border-b-2 p-4`
              }
            >
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
