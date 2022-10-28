import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { JointEstate } from "../dataModels/Node";
import { FirstDeath } from "../dataModels/Node";
import CurrencyFormat from "react-currency-format";
import { TextInput } from "flowbite-react";
import TBInput from "../inputs/TBInput";

export type JointEstateUpdateProps = {
  wifeName?: string;
  husbandName?: string;
  commonPropertyValue?: number;
  husbandExtraValue?: number;
  wifeExtraValue?: number;
  firstDeath?: FirstDeath;
};

export type Props = {
  jointEstate: Partial<JointEstate>;
  setJointEstate: (jointEstate: Partial<JointEstateUpdateProps>) => void;
};

export default function JointEstateForm({
  jointEstate,
  setJointEstate,
}: Props) {
  const [wifeName, setWifeName] = useState(jointEstate.wife?.key);
  useEffect(() => setWifeName(jointEstate.wife?.key), [jointEstate]);

  const [husbandName, setHusbandName] = useState(jointEstate.husband?.key);
  useEffect(() => setHusbandName(jointEstate.husband?.key), [jointEstate]);

  const [wifeExtraValue, setWifeExtraValue] = useState(
    jointEstate.wifeExtraValue
  );
  useEffect(() => setWifeExtraValue(jointEstate.wifeExtraValue), [jointEstate]);

  const [husbandExtraValue, setHusbandExtraValue] = useState(
    jointEstate.husbandExtraValue
  );
  useEffect(
    () => setHusbandExtraValue(jointEstate.husbandExtraValue),
    [jointEstate]
  );

  const [commonPropertyValue, setCommonPropertyValue] = useState(
    jointEstate.commonPropertyValue
  );
  useEffect(
    () => setCommonPropertyValue(jointEstate.commonPropertyValue),
    [jointEstate]
  );

  const [firstDeath, setFirstDeath] = useState(jointEstate.firstDeath);
  useEffect(() => setFirstDeath(jointEstate.firstDeath), [jointEstate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setJointEstate({
      wifeName,
      husbandName,
      commonPropertyValue,
      husbandExtraValue,
      wifeExtraValue,
      firstDeath,
    });
  }
  return (
    <form>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="text"
            name="wife_name"
            id="wife_name"
            value={wifeName}
            onChange={(e) => setWifeName(e.target.value)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="wife_name"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Wife
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="text"
            name="husband_name"
            id="husband_name"
            value={husbandName}
            onChange={(e) => setHusbandName(e.target.value)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="husband_name"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Husband
          </label>
        </div>
      </div>
      <div className="group relative z-0 mb-6 w-full">
        <CurrencyFormat
          thousandSeparator={true}
          prefix={"$"}
          name="common_property_value"
          id="common_property_value"
          value={commonPropertyValue ?? 0}
          onValueChange={(v) =>
            setCommonPropertyValue(isNaN(v.floatValue) ? 0 : v.floatValue)
          }
          customInput={TBInput}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
        />
        <label
          htmlFor="common_property_value"
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Common property value
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="group relative z-0 mb-6 w-full">
          <CurrencyFormat
            thousandSeparator={true}
            prefix={"$"}
            name="wife_extra_value"
            id="wife_extra_value"
            value={wifeExtraValue ?? ""}
            onValueChange={(v) =>
              setWifeExtraValue(isNaN(v.floatValue) ? 0 : v.floatValue)
            }
            customInput={TBInput}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="wife_extra_value"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Wife property value
          </label>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <CurrencyFormat
            thousandSeparator={true}
            prefix={"$"}
            name="husband_extra_value"
            id="husband_extra_value"
            value={husbandExtraValue ?? ""}
            onValueChange={(v) =>
              setHusbandExtraValue(isNaN(v.floatValue) ? 0 : v.floatValue)
            }
            customInput={TBInput}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="husband_extra_value"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Husband property value
          </label>
        </div>
      </div>

      <div className="group relative z-0 mb-6 w-full">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Who to plan for passing fist?
        </h3>
        <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center px-3">
              <input
                id="horizontal-list-radio-license"
                type="radio"
                value={FirstDeath.Husband}
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                checked={firstDeath === FirstDeath.Husband}
                onChange={(e) => setFirstDeath(FirstDeath.Husband)}
              />
              <label
                htmlFor="horizontal-list-radio-license"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {jointEstate?.husband?.key ?? "Husband"}
              </label>
            </div>
          </li>
          <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
            <div className="flex items-center pl-3">
              <input
                id="horizontal-list-radio-id"
                type="radio"
                value={FirstDeath.Wife}
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                checked={firstDeath === FirstDeath.Wife}
                onChange={(e) => setFirstDeath(FirstDeath.Wife)}
              />
              <label
                htmlFor="horizontal-list-radio-id"
                className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {jointEstate?.wife?.key ?? "Wife"}
              </label>
            </div>
          </li>
        </ul>
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
