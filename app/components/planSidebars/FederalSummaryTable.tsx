import type { AnnualGiftSummary } from "../dataModels/Node";

export type Props = {
  annualGiftSummaries?: AnnualGiftSummary[];
};
export default function FederalSummaryTable({ annualGiftSummaries }: Props) {
  if (annualGiftSummaries === undefined) {
    return <></>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Federal Gift & Estate Taxes
            </th>
            {annualGiftSummaries
              .map((summary) => summary.year)
              .map((year) => {
                return (
                  <th
                    key={year ?? "on death"}
                    scope="col"
                    className="py-3 px-6"
                  >
                    {year ?? "On death"}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Total Gifts
            </th>
            {annualGiftSummaries
              .map((summary) => summary.totalGiftValue)
              .map((giftValue, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${giftValue.toLocaleString()}
                  </td>
                );
              })}
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Minus annual exclusions
            </th>
            {annualGiftSummaries
              .map((summary) => summary.minusAnnualExclusions)
              .map((value, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${value.toLocaleString()}
                  </td>
                );
              })}
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Lifetime exclusion applied
            </th>
            {annualGiftSummaries
              .map((summary) => summary.lifetimeExclusionUsed)
              .map((value, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${value.toLocaleString()}
                  </td>
                );
              })}
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              State estate tax deductions
            </th>
            {annualGiftSummaries
              .map((summary) => summary.stateEstateTaxDeduction)
              .map((value, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${value.toLocaleString()}
                  </td>
                );
              })}
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Total taxable value
            </th>
            {annualGiftSummaries
              .map((summary) => summary.taxableValue)
              .map((value, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${value.toLocaleString()}
                  </td>
                );
              })}
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Expected tax
            </th>
            {annualGiftSummaries
              .map((summary) => summary.expectedTax)
              .map((value, index) => {
                return (
                  <td key={index} className="py-4 px-6">
                    ${value.toLocaleString()}
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
  /*
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="pb-4 text-xl">Gift Taxes</h1>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Year
            </th>
            <th scope="col" className="py-3 px-6">
              Total Gifts
            </th>
            <th scope="col" className="py-3 px-6">
              Minus annual exclusions
            </th>
            <th scope="col" className="py-3 px-6">
              Lifetime exclusion applied
            </th>
            <th scope="col" className="py-3 px-6">
              Gift Tax Owed
            </th>
          </tr>
        </thead>
        <tbody>
          {owner.annualGiftSummaries.map((summary) => {
            return (
              <tr
                key={summary.year ?? "death"}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
                >
                  {summary.year ?? "Upon passing"}
                </th>
                <td className="py-4 px-6">
                  ${summary.totalGiftValue.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  ${summary.minusAnnualExclusions.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  ${summary.lifetimeExclusionUsed.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  ${summary.expectedTax.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  */
}
