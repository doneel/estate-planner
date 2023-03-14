import { Link } from "@remix-run/react";
import type { PropsWithChildren } from "react";

export interface Props {
  title: string;
  subtitle: string;
  tag?: string;
  onClick?: () => void;
  to?: string;
}

export default function LibraryEntry({ onClick, title, subtitle, tag, to, children }: Props & PropsWithChildren) {
  const listItem = (
    <li
      key={"create-new"}
      className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg border border-transparent bg-white text-center shadow  hover:border-blue-500 hover:bg-blue-100"
      onClick={to ? onClick : () => {}}
    >
      <div className="flex flex-1 flex-col p-8">
        {/*<img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={person.imageUrl} alt="" />*/}
        {children}

        <h3 className="mt-6 text-sm font-medium text-gray-900">{title}</h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">{subtitle}</dt>
          <dd className="text-sm text-gray-500">{subtitle}</dd>
          {tag ? <dt className="sr-only">{tag}</dt> : <></>}
          {tag ? (
            <dd className="mt-3">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">{"role"}</span>
            </dd>
          ) : (
            <></>
          )}
        </dl>
      </div>
    </li>
  );

  if (to) {
    return (
      <Link to={to} replace={true}>
        {listItem}
      </Link>
    );
  }
  return listItem;
}
