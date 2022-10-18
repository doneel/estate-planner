import type { FormEvent } from "react";
import { useEffect } from "react";
import React from "react";

export type Person = {
  name: string;
  birthYear: number;
  netWorth: number;
  expectedLifeSpan: number;
};

export type Props = {
  person: Partial<Person>;
  setPerson: (person: Partial<Person>) => void;
};

function undefinedIfNan(n?: number) {
  return n ? (isNaN(n) ? undefined : n) : undefined;
}

export default function PersonForm({ person, setPerson }: Props) {
  const [name, setName] = React.useState(person.name);
  useEffect(() => setName(person.name), [person]);

  const [netWorth, setNetWorth] = React.useState(person.netWorth);
  useEffect(() => setNetWorth(person.netWorth), [person]);

  const [birthYear, setBirthYear] = React.useState(person.birthYear);
  useEffect(() => setBirthYear(person.birthYear), [person]);

  const [expectedLifeSpan, setExpectedLifeSpan] = React.useState(
    person.expectedLifeSpan
  );
  useEffect(() => setExpectedLifeSpan(person.expectedLifeSpan), [person]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPerson({
      name: name,
      birthYear: birthYear,
      netWorth: netWorth,
      expectedLifeSpan: expectedLifeSpan,
    });
  }
  console.log("render form with net worth", netWorth, person.netWorth);
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
          defaultValue={person.name}
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
          defaultValue={person.netWorth?.toString()}
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
            defaultValue={person.birthYear}
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
            defaultValue={person.birthYear}
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
