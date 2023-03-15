/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FlagIcon, PencilSquareIcon, ExclamationTriangleIcon, HomeModernIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { FaRoad } from "react-icons/fa";
import { NavLink, Outlet } from "@remix-run/react";
import MapAndControls from "./MapAndControls";

const sidebarNavigation = [
  { name: "Layers", href: "layers", icon: Square3Stack3DIcon, current: false },
  { name: "Buildings", href: "buildings", icon: HomeModernIcon, current: true },
  { name: "Roads", href: "roads", icon: FaRoad, current: false },
  { name: "Parking", href: "parking", icon: FlagIcon, current: false },
  { name: "Stepbacks", href: "stepbacks", icon: ExclamationTriangleIcon, current: false },
  { name: "Drafts", href: "drafts", icon: PencilSquareIcon, current: false },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full overflow-hidden">
        ```
      */}
      <div id="full-page-edit-layout" className="flex h-full w-full flex-col">
        {/* Top nav*/}
        <header className="relative flex flex-shrink-0 items-center bg-white">
          {/* Picker area */}
          <div className="mx-auto md:hidden">
            <div className="relative">
              <label htmlFor="inbox-select" className="sr-only">
                Choose inbox
              </label>
              <ul
                id="inbox-select"
                className="rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-indigo-600"
                defaultValue={sidebarNavigation.find((item) => item.current)?.name}
              >
                {sidebarNavigation.map((item) => (
                  <NavLink key={item.name} to={item.href}>
                    {item.name}
                  </NavLink>
                ))}
              </ul>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </header>

        {/* Bottom section */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Narrow sidebar*/}
          <nav aria-label="Sidebar" className="hidden md:block md:flex-shrink-0 md:overflow-y-auto md:bg-gray-800">
            <div className="relative flex w-20 flex-col space-y-3 p-3">
              {sidebarNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `${isActive ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-700"}
                    inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg`
                  }
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Main area */}
          <main className="min-w-0 flex-1 border-t border-gray-200 lg:flex">
            <MapAndControls>
              <Outlet />
            </MapAndControls>
          </main>
        </div>
      </div>
    </>
  );
}
