import { NavLink } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import {
  FaCheckCircle,
  FaPeopleArrows,
  FaRegCheckCircle,
  FaRegCalendar,
  FaMailBulk,
  FaRegArrowAltCircleLeft,
  FaCartArrowDown,
  FaXing,
  FaCross,
  FaPhoenixSquadron,
  FaStop,
  FaStopCircle,
} from "react-icons/fa";
import type { MessageNotificationData } from "~/routes/adjusting/notifications";

export interface Props {
  notification: SerializeFrom<MessageNotificationData>;
}
export default function TaskNotification({
  notification: {
    id,
    type,
    from,
    title,
    preview,
    createdAt,
    claimId,
    claimNumber,
  },
}: Props) {
  return (
    <NavLink
      key={id}
      className="flex w-full border-x border-t bg-white p-2 first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg last:border-b hover:bg-slate-100"
      to={id}
    >
      <div className="my-auto flex w-20 flex-col items-center justify-center">
        <FaMailBulk size={24} className="text-gray-200" />
        <div className="wrap-pre px-1 text-center text-xs text-gray-400">
          New message
        </div>
      </div>

      <div className="flex grow flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <div className="flex gap-x-2">
            <span className="my-auto rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
              New
            </span>
            <div className="text-sm italic">
              Assigned {new Date(createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <div>
            Claim{" "}
            <NavLink
              className="ml-1 font-semibold text-blue-700 hover:underline"
              to={`/adjusting/claims/${claimId ?? ""}`}
            >
              {claimNumber ?? ""}
            </NavLink>
          </div>
          <div className="text-sm italic ">
            From
            <NavLink
              className="ml-1 font-semibold text-blue-700 hover:underline"
              to={`/adjusting/people/${from ?? ""}`}
            >
              {from ?? ""}
            </NavLink>
          </div>
        </div>

        <div className="my-2 max-w-fit overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-xs font-normal italic italic text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300">
          {preview}
        </div>
        <div className="mt-1 flex justify-start gap-x-3">
          <button
            data-tooltip-target={`tooltip-reassign-${id}`}
            data-tooltip-style="dark"
            type="button"
            className="rounded p-1 text-slate-900 hover:bg-slate-400"
          >
            <FaRegArrowAltCircleLeft size={18} className="" />
          </button>
          <div
            id={`tooltip-reassign-${id}`}
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-sm dark:bg-gray-700"
          >
            Reply
          </div>

          <button
            data-tooltip-target={`tooltip-complete-${id}`}
            data-tooltip-style="dark"
            type="button"
            className="rounded p-1 text-slate-900 hover:bg-slate-400"
          >
            <FaStopCircle size={18} className="" />
          </button>
          <div
            id={`tooltip-complete-${id}`}
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-sm dark:bg-gray-700"
          >
            Stop messages from this thread
          </div>

          <button
            data-tooltip-target={`tooltip-schedule-${id}`}
            data-tooltip-style="dark"
            type="button"
            className="rounded p-1 text-slate-900 hover:bg-slate-400"
          >
            <FaRegCalendar size={18} className="" />
          </button>
          <div
            id={`tooltip-schedule-${id}`}
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-sm dark:bg-gray-700"
          >
            Set due date
          </div>
        </div>
      </div>
    </NavLink>
  );
}
