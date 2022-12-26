import type { Claim } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { FaRegCalendar, FaRegUser } from "react-icons/fa";

export type Props = {
  claim: Claim | SerializeFrom<Claim>;
  size?: "sm" | "lg";
};
export default function ClaimInfoCard({ claim, size = "sm" }: Props) {
  return (
    <div>
      <div className="mb-1 flex w-full justify-between">
        <p
          className={`${
            size === "sm" ? "text-base" : "text-2xl"
          } text-blue-600`}
        >
          {claim.name}
        </p>
        <span className="my-auto rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
          Active
        </span>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col items-start md:items-end">
          <p className={`${size === "sm" ? "text-xs" : "text-sm"} font-light`}>
            File <strong className="font-semibold">{claim.file_number}</strong>
          </p>
          <p className={`${size === "sm" ? "text-xs" : "text-sm"} font-light`}>
            Claim{" "}
            <strong className="font-semibold">{claim.claim_number}</strong>
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center">
            {/* <FaRegCalendar className="w-3 text-slate-500" /> */}
            <p
              className={`${
                size === "sm" ? "text-xs" : "text-sm"
              } ml-2 font-light`}
            >
              Due <strong className="font-semibold">12/12/22</strong>
            </p>
          </div>
          <div className="flex items-center">
            {/* <FaRegUser className="w-3 text-slate-500" /> */}
            {/* TODO: Adjusters should be clickable. Just filter for their claims? */}

            <p
              className={`${
                size === "sm" ? "text-xs" : "text-sm"
              } ml-1 font-light`}
            >
              Me, Mike Jones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
