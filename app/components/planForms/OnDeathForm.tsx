import { useEffect, useState } from "react";
import type { OnDeath } from "../dataModels/Link";

export type Props = {
  onDeath: Partial<OnDeath>;
  setOnDeath: (onDeath: Partial<OnDeath>) => void;
};

export default function OnDeathForm({ onDeath, setOnDeath }: Props) {
  const [type, setType] = useState(onDeath?.value?.type);
  useEffect(() => setType(onDeath.value?.type), [onDeath]);

  return (
    <form>
      <div className="group relative z-0 mb-6 w-full">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Identification
        </h3>
        <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-license"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="horizontal-list-radio-license"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Fixed Amount
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-id"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="horizontal-list-radio-id"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Portion of Estate
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-millitary"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="horizontal-list-radio-millitary"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Remainder
              </label>
            </div>
          </li>
        </ul>
      </div>
    </form>
  );
}
