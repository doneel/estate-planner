import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { OnDeath } from "../dataModels/Link";
import type { ValueType } from "../dataModels/utilities";
import { Fixed, Portion, ValueTypes } from "../dataModels/utilities";

export type Props = {
  onDeath: Partial<OnDeath>;
  setOnDeath: (onDeath: Partial<ValueType>) => void;
};

export default function OnDeathForm({ onDeath, setOnDeath }: Props) {
  const [type, setType] = useState(onDeath?.value?.type);
  useEffect(() => setType(onDeath.value?.type), [onDeath]);

  const currentValue = onDeath?.value;
  const [fixedValue, setFixedValue] = useState(
    currentValue instanceof Fixed ? currentValue?.fixedValue : undefined
  );
  useEffect(
    () =>
      setFixedValue(
        currentValue instanceof Fixed ? currentValue?.fixedValue : undefined
      ),
    [currentValue]
  );

  const [portion, setPortion] = useState(
    currentValue instanceof Portion ? currentValue.portion : undefined
  );
  useEffect(
    () =>
      setPortion(
        currentValue instanceof Portion ? currentValue.portion : undefined
      ),
    [currentValue]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let value: Partial<ValueType> = { type: type ?? ValueTypes.Fixed };
    if (type === ValueTypes.Fixed) {
      value = { type, fixedValue };
    } else if (type === ValueTypes.Portion) {
      value = { type, portion };
    } else if (type === ValueTypes.Remainder) {
      value = { type };
    }
    setOnDeath(value);
  }
  return (
    <form>
      <div className="group relative z-0 mb-6 w-full">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Type
        </h3>
        <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center px-3">
              <input
                id="horizontal-list-radio-license"
                type="radio"
                value={ValueTypes.Fixed}
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                checked={type === ValueTypes.Fixed}
                onChange={(e) => setType(ValueTypes.Fixed)}
              />
              <label
                htmlFor="horizontal-list-radio-license"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Fixed value
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
                checked={type === ValueTypes.Portion}
                onChange={(e) => setType(ValueTypes.Portion)}
              />
              <label
                htmlFor="horizontal-list-radio-id"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Portion
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
                checked={type === ValueTypes.Remainder}
                onChange={(e) => setType(ValueTypes.Remainder)}
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
      <div
        className={`group relative z-0 mb-6 w-full ${
          type === ValueTypes.Fixed ? "" : "hidden"
        }`}
      >
        <input
          type="number"
          name="fixed_value"
          id="fixed_value"
          value={fixedValue ?? ""}
          onChange={(e) => setFixedValue(e.target.valueAsNumber)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="fixed_value"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Amount
        </label>
      </div>

      <div
        className={`group relative z-0 mb-6 w-full ${
          type === ValueTypes.Portion ? "" : "hidden"
        }`}
      >
        <input
          type="number"
          name="portion"
          id="portion"
          value={portion ?? ""}
          onChange={(e) => setPortion(e.target.valueAsNumber)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="fixed_value"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Portion of estate
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
