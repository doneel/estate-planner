import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { FaRegCalendar, FaRegUser } from "react-icons/fa";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { listClaims } from "~/models/claim.server";

export async function loader({ request }: LoaderArgs) {
  const claims = await listClaims(request);
  return json({ claims });
}

export default function ClaimsPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full">
      <div className="justify-top flex w-80 flex-col items-center border-r-2  md:w-1/4">
        <div className="w-full">
          <h2 className="my-4 text-center text-3xl font-bold tracking-tight text-slate-700">
            Find Claims
          </h2>

          {/* Search box */}
          <div className="my-4 w-full px-1">
            <form>
              <label
                htmlFor="default-search"
                className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Search names, numbers, or contact info..."
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <ol className="w-100% mx-1">
            {data.claims.map((claim) => (
              <li
                key={claim.id}
                className="w-full border-x border-t bg-white first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg last:border-b hover:bg-blue-100"
              >
                <NavLink
                  className={({ isActive }) =>
                    `block flex h-full w-full flex-col p-4 text-xl ${
                      isActive ? "bg-red" : ""
                    }`
                  }
                  to={claim.id}
                >
                  <div className="mb-1 flex w-full justify-between">
                    <p className="text-base text-blue-600">{claim.name}</p>
                    <span className="my-auto rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex flex-col items-start md:items-end">
                      <p className="text-sm font-light">
                        File{" "}
                        <strong className="font-semibold">
                          {claim.file_number}
                        </strong>
                      </p>
                      <p className="text-sm font-light">
                        Claim{" "}
                        <strong className="font-semibold">
                          {claim.claim_number}
                        </strong>
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <div className="flex">
                        <FaRegCalendar className="w-3 text-slate-500" />
                        <p className="ml-2 text-sm font-light">
                          Due{" "}
                          <strong className="font-semibold">12/12/22</strong>
                        </p>
                      </div>
                      <div className="flex">
                        <FaRegUser className="w-3 text-slate-500" />
                        {/* TODO: Adjusters should be clickable. Just filter for their claims? */}
                        <p className="ml-2 text-sm">Me, Mike Jones</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="bg-slate-200">
        <Outlet />
      </div>
    </div>
  );
}