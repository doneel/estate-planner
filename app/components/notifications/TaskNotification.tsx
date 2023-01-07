import { NavLink } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import {
  FaCheckCircle,
  FaPeopleArrows,
  FaRegCheckCircle,
  FaRegCalendar,
} from "react-icons/fa";
import type { TaskNotificationData } from "~/routes/adjusting/notifications";

export interface Props {
  notification: SerializeFrom<TaskNotificationData>;
}
export default function TaskNotification({
  notification: {
    id,
    type,
    title,
    preview,
    assignedBy,
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
      <div className="my-auto flex w-20 justify-center">
        <FaCheckCircle size={24} className="text-gray-200" />
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
              to={`adjusting/claims/${claimId ?? ""}`}
            >
              {claimNumber ?? ""}
            </NavLink>
          </div>
          <div className="text-sm italic ">
            From
            <NavLink
              className="ml-1 font-semibold text-blue-700 hover:underline"
              to={`adjusting/people/${assignedBy ?? ""}`}
            >
              {assignedBy ?? ""}
            </NavLink>
          </div>
        </div>
        <div className="mt-1 flex justify-start gap-x-3">
          <button
            data-tooltip-target={`tooltip-reassign-${id}`}
            data-tooltip-style="dark"
            type="button"
            className="rounded p-1 text-slate-900 hover:bg-slate-400"
          >
            <FaPeopleArrows size={18} className="" />
          </button>
          <div
            id={`tooltip-reassign-${id}`}
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-sm dark:bg-gray-700"
          >
            Reassign
          </div>

          <button
            data-tooltip-target={`tooltip-complete-${id}`}
            data-tooltip-style="dark"
            type="button"
            className="rounded p-1 text-slate-900 hover:bg-slate-400"
          >
            <FaRegCheckCircle size={18} className="" />
          </button>
          <div
            id={`tooltip-complete-${id}`}
            role="tooltip"
            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-sm dark:bg-gray-700"
          >
            Mark completed
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
