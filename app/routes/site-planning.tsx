import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, FlagIcon, PencilSquareIcon, XMarkIcon, ExclamationTriangleIcon, HomeModernIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { FaRoad } from "react-icons/fa";
import { NavLink, Outlet } from "@remix-run/react";
import SitePlanningContextProvider from "~/components/site-planning/SitePlanningContextProvider";

const user = {
  name: "Whitney Francis",
  email: "whitney.francis@example.com",
  imageUrl: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "#" },
];
const navigation = [
  {
    name: "Sites",
    href: "sites",
    children: [
      { name: "Technical Support", href: "#" },
      { name: "Sales", href: "#" },
      { name: "General", href: "#" },
    ],
  },
  { name: "Structure Library", href: "structure-library", children: [] },
  { name: "Organization", href: "organization", children: [] },
];

export default function SitePlanning() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div id="full-page-edit-layout" className="flex h-full flex-col">
      {/* Top nav*/}
      <header className="relative flex h-16 flex-shrink-0 items-center bg-slate-100">
        {/* Logo area */}
        <div className="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
          <a href="#" className="flex h-16 w-16 items-center justify-center bg-earth-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-20">
            <img className="h-12 w-auto" src="/images/arda-icon-earth.png" alt="Your Company" />
          </a>
        </div>

        {/* Menu button area */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop nav area */}
        <div className="hidden md:flex md:min-w-0 md:flex-1 md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="relative max-w-2xl text-gray-400 focus-within:text-gray-500">
              <label htmlFor="desktop-search" className="sr-only">
                Search
              </label>
              <input
                id="desktop-search"
                type="search"
                placeholder="Search"
                className="block w-full border-transparent bg-slate-100 pl-12 placeholder-gray-500 focus:border-transparent focus:ring-0 sm:text-sm"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="ml-10 flex flex-shrink-0 items-center space-x-10 pr-4">
            <nav aria-label="Global" className="flex space-x-10">
              {navigation.map((item) => (
                <NavLink key={item.href} to={item.href} className="text-sm font-medium text-gray-900">
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center space-x-8">
              <span className="inline-flex">
                <a href="#" className="-mx-1 rounded-full bg-slate-100 p-1 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </a>
              </span>

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                            Sign Out
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide this `div` based on menu open/closed state */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-600 sm:bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
                enterFrom="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
                enterTo="transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
                leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
                leaveFrom="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
                leaveTo="transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100"
              >
                <Dialog.Panel className="fixed inset-0 z-40 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-lg" aria-label="Global">
                  <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                    <a href="#">
                      <img className="block h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                    </a>
                    <button
                      type="button"
                      className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close main menu</span>
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="max-w-8xl mx-auto mt-2 px-4 sm:px-6">
                    <div className="relative text-gray-400 focus-within:text-gray-500">
                      <label htmlFor="mobile-search" className="sr-only">
                        Search all inboxes
                      </label>
                      <input
                        id="mobile-search"
                        type="search"
                        placeholder="Search all inboxes"
                        className="block w-full rounded-md border-gray-300 pl-10 placeholder-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="max-w-8xl mx-auto py-3 px-2 sm:px-4">
                    {navigation.map((item) => (
                      <Fragment key={item.name}>
                        <a href={item.href} className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100">
                          {item.name}
                        </a>
                        {item.children.map((child) => (
                          <a key={child.name} href={child.href} className="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100">
                            {child.name}
                          </a>
                        ))}
                      </Fragment>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 pb-3">
                    <div className="max-w-8xl mx-auto flex items-center px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user?.imageUrl} alt="" />
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="truncate text-base font-medium text-gray-800">{user.name}</div>
                        <div className="truncate text-sm font-medium text-gray-500">{user.email}</div>
                      </div>
                      <a href="#" className="ml-auto flex-shrink-0 bg-white p-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </a>
                    </div>
                    <div className="max-w-8xl mx-auto mt-3 space-y-1 px-2 sm:px-4">
                      {userNavigation.map((item) => (
                        <a key={item.name} href={item.href} className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50">
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </header>
      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        <SitePlanningContextProvider>
          <Outlet />
        </SitePlanningContextProvider>
      </div>
    </div>
  );
}
