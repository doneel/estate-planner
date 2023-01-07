import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";

export interface TaskNotification {
  id: string;
  type: "task";
  title: string;
  preview?: string;
  assignedBy: string;
}

export interface MessageNotification {
  id: string;
  type: "message";
  title: string;
  preview?: string;
  from: string;
}

export type Notification = TaskNotification | MessageNotification;

export async function loader() {
  return json({
    notifications: [
      {
        id: "1",
        type: "task",
        title: "Reschedule Michael Trotter (adjuster)",
        assignedBy: "Amy Alvarez",
      },
      {
        id: "2",
        type: "message",
        title: "Re: Your claim with United Auto Insurance",
        preview: "Yeah hi that all looks correct, when can you guys come out?",
        from: "Mike Jones",
      },
    ],
  });
}

export default function Notifications() {
  const { notifications } = useLoaderData<typeof loader>();
  return <div className="flex h-full"></div>;
}
