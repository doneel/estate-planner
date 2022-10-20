import type { FormEvent } from "react";
import React, { useEffect, useState } from "react";
import type { Transfer } from "../planSidebars/TransferSidebar";

export type Props = {
  transfer: Partial<Transfer>;
  setTransfer: (transfer: Partial<Transfer>) => void;
};

export default function TransferForm({ transfer, setTransfer }: Props) {
  const [dateAsString, setDateAsString] = useState(
    transfer.date?.toLocaleString()
  );
  useEffect(() => {
    setDateAsString(transfer.date?.toLocaleDateString());
  }, [transfer]);
  const [fixedValue, setFixedValue] = useState(transfer.fixedValue);
  useEffect(() => setFixedValue(transfer.fixedValue), [transfer]);

  const [isGift, setIsGift] = useState(transfer.isGift);
  useEffect(() => setIsGift(transfer.isGift), [transfer]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTransfer({
      date: dateAsString ? new Date(Date.parse(dateAsString)) : undefined,
      fixedValue,
      isGift,
    });
  }
  return (
    <form>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="text"
          id="date_input"
          name="date_input"
          value={dateAsString ?? ""}
          onChange={(e) => setDateAsString(e.target.value)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="Name"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          {dateAsString ? "Date" : "Date (MM/DD/YY)"}
        </label>
      </div>
      <div className="group relative z-0 mb-6 w-full">
        <input
          type="number"
          id="fixed_value_input"
          name="fixed_value_input"
          value={fixedValue}
          onChange={(e) => setFixedValue(e.target.valueAsNumber)}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="fixed_value_input"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Value
        </label>
      </div>
      <div className="group relative z-0 mb-6 w-full">
        <div className="flex items-center rounded border border-gray-200 pl-4 dark:border-gray-700">
          <input
            id="is_gift_checkbox"
            type="checkbox"
            checked={isGift ?? false}
            name="is_gift_checkbox"
            onChange={(e) => setIsGift(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            htmlFor="is_gift_checkbox"
            className="ml-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Is this a gift?
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
