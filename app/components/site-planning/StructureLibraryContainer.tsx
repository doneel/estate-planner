import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useContext, useRef, useState } from "react";
import { CheckIcon, PencilIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { MapContext } from "~/components/maps/MapContext";
import { XCircleIcon } from "@heroicons/react/20/solid";
import LibraryEntry from "./LibraryEntry";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const people = [
  {
    name: "Warehouse model A",
    title: "320ft x 117ft",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/images/building1.png", //"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

export default function BuildingLibrary() {
  const location = useLocation();
  //console.log("start open", location.pathname, !location.pathname.replaceAll("/", "").endsWith("structure-library"), location.pathname.replaceAll("/", ""));
  const [createModalOpen, setCreateModalOpen] = useState(!location.pathname.replaceAll("/", "").endsWith("structure-library"));

  const { buildingLibrary } = useContext(MapContext);

  const cancelButtonRef = useRef(null);
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
              <ul role="list" className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {buildingLibrary?.map((building) => (
                  <li
                    key={building.id}
                    className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg border border-transparent bg-white text-center shadow hover:border-blue-500 hover:bg-blue-100"
                  >
                    <div className="flex flex-1 flex-col p-8">
                      <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={building?.imageUrl || "/images/building1.png"} alt="" />
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
                <LibraryEntry
                  title="Add new structure"
                  subtitle="New"
                  tag="New"
                  to={"new"}
                  onClick={() => {
                    //navigate("new");
                    setCreateModalOpen(true);
                  }}
                >
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
