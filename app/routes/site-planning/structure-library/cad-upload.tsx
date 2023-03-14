import { Transition, Dialog } from "@headlessui/react";
import { CubeIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import LibraryEntry from "~/components/site-planning/LibraryEntry";
import { useDropzone } from "react-dropzone";
import BrowserOnly from "~/components/BrowserOnly";

export default function CadUpload() {
  const [createModalOpen, setCreateModalOpen] = useState(true);
  const [showRender, setShowRender] = useState(false);
  const navigate = useNavigate();
  function closeWindow() {
    setCreateModalOpen(false);
    navigate("/site-planning/structure-library");
  }
  const cancelButtonRef = useRef(null);
  const onDrop = useCallback((acceptedFiles: any[]) => {
    console.log(acceptedFiles);
    setShowRender(true);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
                  <h2 className="text-2xl text-gray-900">Upload CAD file</h2>
                  <button type="button" className="" onClick={() => closeWindow()} ref={cancelButtonRef}>
                    <XMarkIcon className="w-8" />
                  </button>
                </div>
                <div className={`p-8 ${showRender ? "hidden" : "flex"}`}>
                  <div className="flex w-full items-center justify-center">
                    <label
                      htmlFor="dropzone-file"
                      className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6" {...getRootProps()}>
                        <svg aria-hidden="true" className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input {...getInputProps()} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className={`m-8  ${showRender ? "flex" : "hidden"}  justify-center rounded-lg border border-slate-400 bg-slate-100 p-4`}>
                  <BrowserOnly importElementFn={() => import("~/components/site-planning/CadRender")} />
                </div>
                <div className={`mt-5 hidden sm:mt-6 sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 ${showRender ? "sm:grid" : "sm:hidden"}`}>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => closeWindow()}
                  >
                    Load structure 0
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
