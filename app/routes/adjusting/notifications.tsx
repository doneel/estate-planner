import type { Claim } from "@prisma/client";
import { NavLink, useLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Message } from "postcss";
import { stringify } from "querystring";
import { useEffect } from "react";
import MessageNotification from "~/components/notifications/MessageNotification";
import TaskNotification from "~/components/notifications/TaskNotification";

export enum NotificationType {
  Task = "task",
  Message = "message",
}
export interface TaskNotificationData {
  id: string;
  type: NotificationType.Task;
  title: string;
  preview?: string;
  assignedBy: string;
  createdAt: Date;
  claimId: Claim["id"];
  claimNumber: Claim["claim_number"];
}

export interface MessageNotificationData {
  id: string;
  type: NotificationType.Message;
  title: string;
  preview?: string;
  from: string;
  createdAt: Date;
  claimId?: Claim["id"];
  claimNumber?: Claim["claim_number"];
}

export type SerializedNotification =
  | SerializeFrom<TaskNotificationData>
  | SerializeFrom<MessageNotificationData>;

function isMessage(
  notification: SerializedNotification
): notification is SerializeFrom<MessageNotificationData> {
  return notification.type === NotificationType.Message;
}
function isTask(
  notification: SerializeFrom<SerializedNotification>
): notification is SerializeFrom<TaskNotificationData> {
  return notification.type === NotificationType.Task;
}
export async function loader() {
  return json({
    notifications: [
      {
        id: "1",
        type: NotificationType.Task,
        title: "Reschedule Michael Trotter (adjuster)",
        assignedBy: "Amy Alvarez",
        createdAt: new Date(2022, 12, 19, 9, 34, 3),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "PC23409A3",
      },
      {
        id: "2",
        type: NotificationType.Message,
        title: "Re: Your claim with United Auto Insurance",
        preview: "Yeah hi that all looks correct, when can you guys come out?",
        from: "Mike Jones",
        createdAt: new Date(2022, 12, 19, 12, 9, 3),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "AM032C90",
      },
      {
        id: "3",
        type: NotificationType.Message,
        title: "Text from John Ziegler",
        preview: "Yeah this is John",
        from: "John Ziegler",
        createdAt: new Date(2022, 12, 19, 13, 12, 3),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "AM032C90",
      },
      {
        id: "4",
        type: NotificationType.Message,
        title: "Text from APC Autobody",
        preview: "I'm here till 5:30, when can the client come by?",
        from: "APC Autobody",
        createdAt: new Date(2022, 12, 20, 8, 54, 18),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "CM390J80",
      },
      {
        id: "5",
        type: NotificationType.Task,
        title: "Approve claim submission",
        assignedBy: "Amy Alvarez",
        createdAt: new Date(2022, 12, 20, 11, 2, 44),
        claimId: "clbziq25c0007c9kq7doye2sk",
        claimNumber: "PC23409A3",
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
          // @ts-ignore
          if (isTask(notification)) {
            return (
              <TaskNotification
                key={notification.id}
                notification={{
                  ...notification,
                  type: NotificationType.Task,
                }}
              />
            );
          }
          // @ts-ignore
          if (isMessage(notification)) {
            return (
              <MessageNotification
                key={notification.id}
                notification={{
                  ...notification,
                  type: NotificationType.Message,
                }}
              />
            );
          }
          return <></>;
        })}
      </div>
    </div>
  );
}
