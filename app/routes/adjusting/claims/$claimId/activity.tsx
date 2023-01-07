import { NavLink } from "@remix-run/react";
import { FaPrint, FaRegCalendar } from "react-icons/fa";
import EmailActivity from "~/components/activities/EmailActivity";

export default function Activity() {
  return (
    <div className="p-16">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        <li className="relative mb-10 ml-6">
          <span className="absolute -left-9 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
            <FaPrint />
          </span>
          <div className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
            <div className="sm:order-last">
              <span className="mr-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                Pending
              </span>
              <time className="mb-1 text-xs font-normal text-gray-400  sm:mb-0">
                {new Date(2022, 11, 12, 12, 37).toLocaleDateString()}{" "}
                {new Date(2022, 11, 12, 12, 37).toLocaleTimeString()}
              </time>
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
              Claim received from United Car Insurance National.
            </div>
          </div>
        </li>
        <EmailActivity
          from={"Mark Jackson"}
          emailPreviewText={
            "Hi John, this is Mark reaching out from Example Adjusters, Inc. about your recent auto insurance claim. I'd love to get someone out to take a look this week. Will you be around Monday or Tuesday?"
          }
          date={new Date(2022, 11, 12, 15, 22, 0)}
          status={"active"}
        />
        <EmailActivity
          from={"John Ziegler"}
          emailPreviewText={
            "Thanks Mark. I'm available on Tuesday morning before 11:15. Does that work for you?"
          }
          date={new Date(2022, 11, 13, 8, 7, 0)}
          status={"active"}
        />
        <li className="relative mb-10 ml-6">
          <span className="absolute -left-9 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
            <FaRegCalendar />
          </span>
          <div className="items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex">
            <div className="sm:order-last">
              <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                Active
              </span>
              <time className="mb-1 text-xs font-normal text-gray-400  sm:mb-0">
                {new Date(2022, 11, 12, 12, 37, 13, 12).toLocaleDateString()}{" "}
                {new Date(2022, 11, 12, 12, 37, 13, 12).toLocaleTimeString()}
              </time>
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
              <NavLink
                to="#"
                className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
              >
                Mark Jackson
              </NavLink>{" "}
              scheduled an inspection for Tuesday 11/15 at 9:30am
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
}
