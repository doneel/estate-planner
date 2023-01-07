import type { Claim } from "@prisma/client";
import { NavLink, useLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { stringify } from "querystring";
import { useEffect } from "react";
import TaskNotification from "~/components/notifications/TaskNotification";

export interface TaskNotificationData {
  id: string;
  type: "task";
  title: string;
  preview?: string;
  assignedBy: string;
  createdAt: Date;
  claimId: Claim["id"];
  claimNumber: Claim["claim_number"];
}

function isTask(
  notification: SerializeFrom<Notification>
): notification is SerializeFrom<TaskNotificationData> {
  return notification.type === "task";
}

export interface MessageNotification {
  id: string;
  type: "message";
  title: string;
  preview?: string;
  from: string;
  createdAt: Date;
}

export type Notification = TaskNotificationData | MessageNotification;

export async function loader() {
  return json({
    notifications: [
      {
        id: "1",
        type: "task",
        title: "Reschedule Michael Trotter (adjuster)",
        assignedBy: "Amy Alvarez",
        createdAt: new Date(2022, 12, 19, 9, 34, 3),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "PC23409A3",
      },
      {
        id: "2",
        type: "message",
        title: "Re: Your claim with United Auto Insurance",
        preview: "Yeah hi that all looks correct, when can you guys come out?",
        from: "Mike Jones",
        createdAt: new Date(2022, 12, 19, 12, 9, 3),
      },
    ],
  });
}

export default function Notifications() {
  const { notifications } = useLoaderData<typeof loader>();

  useEffect(() => {
    async function importFlowbite() {
      // @ts-ignore
      await import("../../../node_modules/flowbite/dist/flowbite");
    }
    importFlowbite();
  });
  return (
    <div className="mx-auto flex h-full w-full items-start justify-center overflow-y-scroll py-4">
      <div className="w-full md:w-1/2 md:max-w-[50%]">
        {notifications.map((notification) => {
          return isTask(notification) ? (
            <TaskNotification
              notification={{ ...notification, type: "task" }}
            />
          ) : (
            <></>
          );
        })}
      </div>
    </div>
  );
}
