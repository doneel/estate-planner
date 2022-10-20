import type { FormEvent } from "react";
import { useEffect } from "react";
import React from "react";
import type { Owner } from "../dataModels/Node";

export type Props = {
  owner: Partial<Owner>;
  setOwner: (owner: Partial<Owner>) => void;
};

export default function OwnerForm({ owner, setOwner }: Props) {
  const [name, setName] = React.useState(owner.key);
  useEffect(() => setName(owner.key), [owner]);

  const [netWorth, setNetWorth] = React.useState(owner.netWorth);
  useEffect(() => setNetWorth(owner.netWorth), [owner]);

  const [birthYear, setBirthYear] = React.useState(owner.birthYear);
  useEffect(() => setBirthYear(owner.birthYear), [owner]);

  const [expectedLifeSpan, setExpectedLifeSpan] = React.useState(
    owner.expectedLifeSpan
  );
  useEffect(() => setExpectedLifeSpan(owner.expectedLifeSpan), [owner]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setOwner({
      key: name,
      birthYear: birthYear,
      netWorth: netWorth,
      expectedLifeSpan: expectedLifeSpan,
    });
  }
  return (
    <form>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="text"
          name="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="Name"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Name
        </label>
      </div>
      <div className="group relative z-0 mb-6 w-full"></div>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="number"
          name="netWorth"
          id="netWorth"
          value={netWorth ?? ""}
          onChange={(e) => setNetWorth(e.target.valueAsNumber)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="netWorth"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Net worth today
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="number"
            name="birthYear"
            id="birthYear"
            value={birthYear ?? ""}
            onChange={(e) => setBirthYear(e.target.valueAsNumber)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="birthYear"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Birth Year
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="number"
            name="expectedLifespan"
            id="expectedLifespan"
            value={expectedLifeSpan ?? ""}
            onChange={(e) => setExpectedLifeSpan(e.target.valueAsNumber)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="birthYear"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Life span (years)
          </label>
        </div>
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
