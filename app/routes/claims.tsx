import type { Claim } from ".prisma/client";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import {
  FaCalendar,
  FaCalendarCheck,
  FaCalendarMinus,
  FaRegCalendar,
  FaRegUser,
  FaUser,
} from "react-icons/fa";
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
    <div className="flex h-full min-h-screen">
      <div className="justify-top flex h-full w-80 flex-col items-center border-r-2 bg-gray-100 md:w-1/4">
        <div className="w-full">
          <h2 className="text-center text-2xl text-slate-900">Active Claims</h2>
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
