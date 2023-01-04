import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import invariant from "tiny-invariant";

export async function loader({ request, params }: LoaderArgs) {
  const threadId = params.threadId;
  invariant(threadId, "Message does not exist.");
  const thread = {
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
  };
  return json({ thread });
}

export default function Thread() {
  const { thread } = useLoaderData<typeof loader>();

  const [input, setInput] = useState("");

  return (
    <div className="flex h-full  w-full flex-col">
      <div className="flex  w-full grow flex-col rounded border-t border-l border-r bg-white p-4">
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`mb-10 ml-6 ${
              message.from === "ClaimCorp"
                ? "place-self-end"
                : "place-self-start"
            }`}
          >
            <time className="mb-1 text-xs font-normal text-gray-400  sm:mb-0">
              {new Date(message.at).toLocaleString()}
            </time>
            <div
              className={`${
                message.from === "ClaimCorp"
                  ? "border-blue-200"
                  : "border-gray-200"
              } items-center justify-between rounded-lg border  bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:flex`}
            >
              <div className="sm:order-last"></div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <form className="flex items-center justify-center space-x-4 border-l border-r border-b bg-white p-4">
          <textarea
            name="input"
            id="input"
            aria-multiline={true}
            rows={1}
            draggable={false}
            className="w-3/4 flex-1 rounded-md border-2 border-blue-200 px-3 text-lg leading-loose"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button type="submit">
            <FaArrowCircleRight
              className={`${input.length ? "text-blue-700" : "text-blue-200"}`}
              size={"24"}
            />
          </button>
        </form>
      </div>
    </div>
  );
}
