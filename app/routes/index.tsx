import { Link } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Navbar from "~/components/header/Navbar";
import { Link as ScrollLink } from "react-scroll";
import { useOptionalUser } from "~/utils";
import BrowserOnly from "../components/BrowserOnly";
import GlobalFooter from "~/components/footer/GlobalFooter";

export async function loader({ request }: LoaderArgs) {
  //throw redirect("/plan");
  return json({});
}

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <Navbar></Navbar>
      <main className="relative min-h-screen w-full bg-slate-50 sm:items-center sm:justify-center">
        <div className="sm:pb-8 sm:pt-8">
          <section className="bg-slate-50 dark:bg-gray-900">
            <div className="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
              <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
                  Estate planning tools for attorneys who care.
                </h1>
                <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                  From diagramming to scenario planning, estate attorneys use
                  Mandos Estates to explain their recommendations and help
                  clients make decisions.
                </p>
                <ScrollLink
                  smooth={true}
                  spy={true}
                  to="homepageDemo"
                  className="hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 mr-3 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white focus:ring-4"
                >
                  Try it now
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </ScrollLink>
                <Link
                  to="#"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Speak to Sales
                </Link>
              </div>
              <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                  alt="mockup"
                />
              </div>
            </div>
          </section>
          <div
            id="homepageDemo"
            className="mx-1 border border-gray-300 bg-white"
          >
            <BrowserOnly
              importElementFn={() =>
                import("~/components/diagramWorkspace/EmbeddableDemo")
              }
            />
          </div>
        </div>
        <GlobalFooter />
      </main>
    </>
  );
}
