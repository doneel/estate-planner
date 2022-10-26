import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import type { Trust } from "../dataModels/Node";

export type Props = {
  trust: Partial<Trust>;
  setTrust: (trust: Partial<Trust>) => void;
};
export default function TrustForm({ trust, setTrust }: Props) {
  const [name, setName] = useState(trust.name);
  useEffect(() => setName(trust.name), [trust]);

  const [trustees, setTrustees] = useState(trust.trustees);
  useEffect(() => setTrustees(trust.trustees), [trust]);

  const [notes, setNotes] = useState(trust.notes);
  useEffect(() => setNotes(trust.notes), [trust]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTrust({
      name,
      trustees,
      notes,
    });
  }
  return (
    <form>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="name"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Name
        </label>
      </div>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="text"
          name="trustees"
          id="trustees"
          value={trustees ?? ""}
          onChange={(e) => setTrustees(e.target.value)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="trustees"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Trustee(s)
        </label>
      </div>
      <div className="group relative z-0 mb-6 w-full">
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Your message
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={4}
          value={notes ?? "• \r• \r• \r• \r "}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder={"• \r• \r• \r• \r "}
        ></textarea>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Update
      </button>
    </form>
  );
}
