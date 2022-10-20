import type { Owner } from "../dataModels/Node";

export type Props = {
  owner: Partial<Owner>;
};
export default function OwnerGiftSummaryTable({ owner }: Props) {
  if (owner.annualGiftSummaries === undefined) {
    return <></>;
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
              Gifts over annual limit
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
                key={summary.year}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-900"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
                >
                  {summary.year}
                </th>
                <td className="py-4 px-6">
                  ${summary.totalGiftValue.toLocaleString()}
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
}
