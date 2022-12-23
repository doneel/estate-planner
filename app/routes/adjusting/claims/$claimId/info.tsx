import type { LoaderArgs, SerializeFrom } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import invariant from "tiny-invariant";
import {
  CLAIM_ROLES,
  getClaimById,
  getFullClaimInfo,
} from "~/models/claim.server";
import { PermissionError } from "~/utils";
import { useLoaderData } from "@remix-run/react";
import { datacatalog } from "googleapis/build/src/apis/datacatalog";
import type { Claim } from ".prisma/client";

export async function loader({ request, params }: LoaderArgs) {
  const claimId = params.claimId;
  invariant(claimId, "Claim does not exist.");
  let claim = undefined;
  let error = undefined;
  try {
    claim = await getFullClaimInfo(claimId, request);
    return json({ claim, error: undefined });
  } catch (e: unknown) {
    error = e;
  }
  return json({ claim, error });
}

export default function ClaimInfo() {
  const data = useLoaderData<typeof loader>();

  if (data.error || !data.claim) {
    return (
      <div className="">
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-5xl font-extrabold tracking-tight lg:text-7xl">
                Permission denied
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                You don't have access to this claim.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Contact your administrator if you think you should be listed as
                an adjuster.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
  const adjusters = data.claim.ClaimRoles.filter(
    (role) => role.role === CLAIM_ROLES.Adjuster
  ).map((role) => role.user.email);
  return (
    <div className="flex w-full">
      <div className="w-1/2 overflow-hidden bg-white shadow sm:first:rounded-tl-lg sm:first:rounded-bl-lg sm:last:rounded-tr-lg sm:last:rounded-br-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Claim Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Claimant and details
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Claim Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.claim_number}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">File Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.file_number}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Carrier</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.carrier.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Received</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(data.claim.receivedAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Adjusters</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {adjusters.length > 0 ? adjusters : "None assigned"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        claimant_filing.pdf
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        policy_documentation.pdf
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="w-1/2 overflow-hidden bg-white shadow sm:first:rounded-tl-lg sm:first:rounded-bl-lg sm:last:rounded-tr-lg sm:last:rounded-br-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Claimant
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.claimant?.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.claimant?.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {data.claim.claimant?.phone}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {"123 Main Street\nSan Jose, CA 94302"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
