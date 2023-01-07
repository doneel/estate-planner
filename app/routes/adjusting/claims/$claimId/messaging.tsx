import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
export interface Message {
  id: string;
  at: Date;
  from: string;
  content: string;
}

export interface Thread {
  id: string;
  members: string[];
  messages: Message[];
  lastViewed: Date;
}
export async function loader() {
  return json({
    threads: [
      {
        id: "t1",
        members: ["John Ziegler"],
        lastViewed: new Date(2022, 12, 9, 17, 8, 5),
        messages: [
          {
            id: "t1m1",
            at: new Date(2022, 12, 9, 17, 1, 5),
            from: "ClaimCorp",
            content: "Hi this is Amanda from ClaimCorp. Is this John?",
          },
          {
            id: "t1m2",
            at: new Date(2022, 12, 9, 119, 1, 5),
            from: "John Ziegler",
            content: "Yeah this is John",
          },
        ],
      },
      {
        id: "t2",
        members: ["650-392-4923", "EZ Autobody"],
        lastViewed: new Date(2022, 12, 9, 17, 8, 5),
        messages: [
          {
            id: "t2m1",
            at: new Date(2022, 12, 9, 13, 1, 5),
            from: "ClaimCorp",
            content: "Hey I have some work I need quoted",
          },
          {
            id: "t2m2",
            at: new Date(2022, 12, 9, 13, 1, 5),
            from: "EZ Autobody",
            content: "Give me a call at 2.",
          },
        ],
      },
    ],
  });
}
function lastMessage(thread: SerializeFrom<Thread>) {
  return thread.messages?.at(-1);
}
export default function Messaging() {
  const { threads } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full w-full p-4">
      <div className="w-1/3">
        <ol className="mx-1 w-full">
          {threads?.map((thread) => (
            <li
              key={thread.id}
              className="w-full border-x border-t bg-white first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg last:border-b"
            >
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "rounded border-r-4 border-blue-400 p-2 pr-2"
                      : "pr-[12px]"
                  }
                 flex flex-col gap-y-2 p-2
                 `
                }
                to={thread.id}
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="mr-2 ">{lastMessage(thread)?.from}</div>
                    <span className="my-auto rounded bg-gray-100 px-2.5 py-0.5 text-sm font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
                      {thread.messages.length}
                    </span>
                  </div>
                  <div className="flex">
                    {thread.lastViewed >
                    (lastMessage(thread)?.at || Date.now()) ? (
                      <span className="my-auto mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-normal text-gray-800 dark:bg-gray-600 dark:text-gray-300">
                        New
                      </span>
                    ) : (
                      <></>
                    )}
                    <div className=" font-light">
                      {new Date(
                        lastMessage(thread)?.at ?? -1
                      ).toLocaleString() ?? ""}
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden text-ellipsis text-sm">
                  {lastMessage(thread)?.content.substring(
                    0,
                    Math.min(100, lastMessage(thread)?.content.length ?? 0)
                  )}
                </div>
              </NavLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="ml-4 h-full grow">
        <Outlet />
      </div>
    </div>
  );
}
