import type { WashingtonEstateTaxSummary } from "../dataModels/calculators/washington";

export type Props = {
  taxSummary: WashingtonEstateTaxSummary;
};

export default function WashingtonTaxSummaryTab({ taxSummary }: Props) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Washington Estate Taxes
            </th>
            <th scope="col" className="py-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Gross Estate at Death
            </th>
            <td className="py-4 px-6">
              ${taxSummary.totalValueAtDeath.toLocaleString()}
            </td>
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Marital and charitable deductions
            </th>
            <td className="py-4 px-6">
              ${taxSummary.maritalAndCharitableDeductions.toLocaleString()}
            </td>
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Washington Exclusion
            </th>
            <td className="py-4 px-6">
              ${taxSummary.washingtonExclusionAmount.toLocaleString()}
            </td>
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Qualified Farm and Woodland Deduction
            </th>
            <td className="py-4 px-6">
              $
              {(
                taxSummary.qualifiedFarmAndWoodlandDeduction ?? 0
              ).toLocaleString()}
            </td>
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Washington Taxable Estate
            </th>
            <td className="py-4 px-6">
              ${taxSummary.washingtonTaxableEstate.toLocaleString()}
            </td>
          </tr>

          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <th
              scope="row"
              className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
            >
              Washington Estate Tax
            </th>
            <td className="py-4 px-6">
              ${taxSummary.washingtonEstateTax.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
