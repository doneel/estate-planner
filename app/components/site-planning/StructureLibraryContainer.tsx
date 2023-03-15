import { useContext } from "react";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { MapContext } from "~/components/maps/MapContext";
import { XCircleIcon } from "@heroicons/react/20/solid";
import LibraryEntry from "./LibraryEntry";
import { Outlet } from "@remix-run/react";

export default function BuildingLibrary() {
  const { buildingLibrary } = useContext(MapContext);

  return (
    <div className="min-h-full w-full border-t border-gray-300 bg-gray-100 shadow-lg">
      <div className="mx-auto my-16 max-w-7xl overflow-hidden rounded-lg bg-gray-200 shadow-sm">
        <div className="px-4 py-5 sm:pb-10">
          <div className="py-10">
            <header className="py-5 sm:py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-700">Structure Library</h1>
              </div>
            </header>
            <main>
              <ul className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {buildingLibrary?.map((building) => (
                  <li
                    key={building.id}
                    className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg border border-transparent bg-white text-center shadow hover:border-blue-500 hover:bg-blue-100"
                  >
                    <div className="flex flex-1 flex-col p-8">
                      <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={building?.name || "/images/building1.png"} alt="" />
                      <h3 className="mt-6 text-sm font-medium text-gray-900">{building.name}</h3>
                      <dl className="mt-1 flex flex-grow flex-col justify-between">
                        <dt className="sr-only">Title</dt>
                        <dd className="text-sm text-gray-500">{building.dimensions.join(" x ")}</dd>
                        <dt className="sr-only">Role</dt>
                        <dd className="mt-3">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">{building.area}</span>
                        </dd>
                      </dl>
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <a
                            href={"edit"}
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            Edit
                          </a>
                        </div>
                        <div className="-ml-px flex w-0 flex-1">
                          <a
                            href={"remove"}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                          >
                            <XCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            Remove
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <LibraryEntry title="Add new structure" subtitle="New" tag="New" to={"new"}>
                  <PlusCircleIcon className="mx-auto h-32 w-32 rounded-full" />
                </LibraryEntry>
              </ul>
            </main>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
