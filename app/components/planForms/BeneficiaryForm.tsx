import type { FormEvent } from "react";
import React, { useEffect } from "react";
import type { Beneficiary } from "../dataModels/Node";

export type Props = {
  beneficiary: Partial<Beneficiary>;
  setBeneficiary: (beneficiary: Partial<Beneficiary>) => void;
};

export default function BeneficiaryForm({
  beneficiary,
  setBeneficiary,
}: Props) {
  const [name, setName] = React.useState(beneficiary.key);
  useEffect(() => setName(beneficiary.key), [beneficiary]);

  const [birthYear, setBirthYear] = React.useState(beneficiary.birthYear);
  useEffect(() => setBirthYear(beneficiary.birthYear), [beneficiary]);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBeneficiary({
      key: name,
      birthYear,
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
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="number"
          name="birth_year"
          id="birth_year"
          value={birthYear ?? ""}
          onChange={(e) => setBirthYear(e.target.valueAsNumber)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="date_of_birth"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Birth year
        </label>
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
