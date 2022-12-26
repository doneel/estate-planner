import { NavLink } from "@remix-run/react";
import { FaMailBulk } from "react-icons/fa";

export interface Props {
  from: string;
  date: Date;
  emailPreviewText: string;
  status?: string;
}
export default function EmailActivity({
  from,
  emailPreviewText,
  date,
  status,
}: Props) {
  return (
    <li className="relative mb-10 ml-6">
      <span className="absolute -left-9 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
        <FaMailBulk />
      </span>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700">
        <div className="mb-3 items-center  justify-between bg-white dark:border-gray-600 dark:bg-gray-700 sm:flex">
          <div className="sm:order-last">
            <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
              {status}
            </span>
            <time className="mb-1 text-xs font-normal text-gray-400 sm:mb-0">
              {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </time>
          </div>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
            Email recieved from{" "}
            <NavLink
              to="#"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
            >
              {from}
            </NavLink>
            .
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs font-normal italic text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300">
            {emailPreviewText}
          </div>
        </div>
      </div>
    </li>
  );
}
