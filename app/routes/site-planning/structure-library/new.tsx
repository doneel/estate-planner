import { Transition, Dialog } from "@headlessui/react";
import { CubeIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import { Fragment, useEffect, useRef, useState } from "react";
import LibraryEntry from "~/components/site-planning/LibraryEntry";

export default function NewStructureMenu({}) {
  const [createModalOpen, setCreateModalOpen] = useState(!location.pathname.replaceAll("/", "").endsWith("structure-library"));
  const navigate = useNavigate();
  function closeWindow() {
    setCreateModalOpen(false);
    if (location.pathname.replaceAll("/", "").endsWith("new")) {
      navigate("/site-planning/structure-library");
    }
  }
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={createModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={closeWindow}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 md:max-w-5xl">
                <div className="flex flex-row justify-between px-8">
                  <h2 className="text-2xl text-gray-900">Add a new structure</h2>
                  <button type="button" className="" onClick={() => closeWindow()} ref={cancelButtonRef}>
                    <XMarkIcon className="w-8" />
                  </button>
                </div>
                <div>
                  <ul className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3">
                    <LibraryEntry title="Rectangle" subtitle="Set dimensions manually" onClick={() => console.log("Clicked")}>
                      <CubeIcon className="mx-auto w-24" />
                    </LibraryEntry>
                    <LibraryEntry title="Upload CAD" subtitle="Upload AutoCad file with building dimensions" to={"/site-planning/structure-library/cad-upload"}>
                      <img src="/images/AutocadLogo.svg" alt="Autocad logo" className="mx-auto h-24" />
                    </LibraryEntry>
                    <LibraryEntry title="Free draw" subtitle="Draw building polygon by hand" onClick={() => console.log("Clicked")}>
                      <PencilSquareIcon className="mx-auto w-24" />
                    </LibraryEntry>
                  </ul>
                </div>
                <div className="mt-5 hidden sm:mt-6 sm:grid sm:hidden sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => closeWindow()}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => closeWindow()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
