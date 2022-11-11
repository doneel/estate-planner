import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  //throw redirect("/plan");
  const userId = await getUserId(request);

  return json({ userId: userId });
}

export default function Navbar() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <header>
      <nav className="border-b border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <Link to="htts://flowbite.com" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Mandos Estates
            </span>
          </Link>

          <div className="flex items-center lg:order-2">
            <Link
              to="/login"
              className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 lg:px-5 lg:py-2.5"
            >
              Log in
            </Link>
            <Link
              to="/login"
              className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
            >
              Sign up
            </Link>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
            id="mobile-menu-2"
          >
            <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
              <li>
                <Link
                  to="/"
                  className="bg-primary-700 lg:text-primary-700 block rounded py-2 pr-4 pl-3 text-white dark:text-white lg:bg-transparent lg:p-0"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  id="mega-menu-dropdown-button"
                  data-dropdown-toggle="mega-menu-dropdown"
                  className="flex w-full items-center justify-between border-b border-gray-100 py-2 pr-4 pl-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:w-auto md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-600 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                >
                  Features{" "}
                  <svg
                    aria-hidden="true"
                    className="ml-1 h-5 w-5 md:h-4 md:w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <div
                  id="mega-menu-dropdown"
                  className="absolute z-10 grid hidden w-auto grid-cols-1 rounded-lg border border-gray-100 bg-white text-sm shadow-md dark:border-gray-700 dark:bg-gray-700 md:grid-cols-1"
                >
                  <div className="p-4 pb-0 text-gray-900 dark:text-white md:pb-4">
                    <ul
                      className="space-y-4"
                      aria-labelledby="mega-menu-dropdown-button"
                    >
                      <li>
                        <Link
                          to="#"
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                        >
                          Diagramming
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                        >
                          Tax calculations
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="#"
                  className="lg:hover:text-primary-700 block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:dark:hover:bg-transparent lg:dark:hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="lg:hover:text-primary-700 block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:border-0 lg:p-0 lg:hover:bg-transparent lg:dark:hover:bg-transparent lg:dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
