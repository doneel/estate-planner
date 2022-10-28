import {
  ANNUAL_GIFT_EXCLUSIONS_PER_RECIPIENT,
  GIFT_TAX_RATE,
  LIFETIME_GIFT_EXCLUSIONS,
} from "../constants";
import { AnnualGiftSummary } from "../Node";
import { SUM } from "../utilities";

export type GiftOutflow = {
  date?: Date;
  to: string;
  expectedValue: number;
};

type GiftsByRecipient = {
  [recipient: string]: number;
};

export type LivingGiftOutflow = GiftOutflow & { date: Date };

export function calculateFederalGiftTax(
  outflows: GiftOutflow[],
  deductionForStateTaxesOnDeath: number = 0
): AnnualGiftSummary[] {
  const yearlyGifts: { [year: number]: GiftsByRecipient } = {};
  outflows
    .filter((o): o is LivingGiftOutflow => o.date !== undefined)
    .forEach((outflow) => {
      if (yearlyGifts[outflow.date?.getFullYear()] === undefined) {
        yearlyGifts[outflow.date?.getFullYear()] = {};
      }
      if (yearlyGifts[outflow.date?.getFullYear()][outflow.to] === undefined) {
        yearlyGifts[outflow.date?.getFullYear()][outflow.to] = 0;
      }
      yearlyGifts[outflow.date?.getFullYear()][outflow.to] +=
        outflow.expectedValue;
    });
  const outflowsOnDeath: GiftsByRecipient = {};
  outflows
    .filter((o) => o.date === undefined)
    .forEach((outflow) => {
      if (outflowsOnDeath[outflow.to] === undefined) {
        outflowsOnDeath[outflow.to] = 0;
      }
      outflowsOnDeath[outflow.to] += outflow.expectedValue;
    });

  const giftSummaries: AnnualGiftSummary[] = [];
  let lifetimeExclusionAlreadyUsed = 0;
  Object.entries(yearlyGifts).forEach(([yearString, giftsByRecipient]) => {
    const giftSummary = giftSummaryForYear(
      Number(yearString),
      giftsByRecipient,
      lifetimeExclusionAlreadyUsed
    );
    giftSummaries.push(giftSummary);
    lifetimeExclusionAlreadyUsed += giftSummary.lifetimeExclusionUsed;
  });
  const giftSummaryOnDeath = giftSummaryForYear(
    new Date().getFullYear(),
    outflowsOnDeath,
    lifetimeExclusionAlreadyUsed,
    deductionForStateTaxesOnDeath
  );
  //override year here.
  giftSummaryOnDeath.year = undefined;
  giftSummaries.push(giftSummaryOnDeath);
  return giftSummaries;
}

function giftSummaryForYear(
  year: number,
  giftsByRecipient: GiftsByRecipient,
  lifetimeExclusionAlreadyUsed: number,
  deductionForStateTaxesOnDeath?: number
): AnnualGiftSummary {
  const annualExclusion = ANNUAL_GIFT_EXCLUSIONS_PER_RECIPIENT(year);
  const lifetimeExclusionAsOfThisYear = LIFETIME_GIFT_EXCLUSIONS(year);
  const totalGifts = Object.values(giftsByRecipient).reduce(SUM, 0);
  const excessesOverLimit = annualExclusion
    ? Object.values(giftsByRecipient)
        .map((giftValue) => giftValue - annualExclusion)
        .filter((excess) => excess > 0)
        .reduce(SUM, 0)
    : 0;

  let taxes_owed = 0;
  let appliedLifetimeLimit = 0;
  let taxable = 0;
  if (lifetimeExclusionAsOfThisYear) {
    const headroom =
      lifetimeExclusionAsOfThisYear - lifetimeExclusionAlreadyUsed;
    taxable = Math.max(excessesOverLimit - headroom, 0);
    appliedLifetimeLimit = Math.min(excessesOverLimit, headroom);
    if (deductionForStateTaxesOnDeath) {
      taxable = Math.max(taxable - deductionForStateTaxesOnDeath, 0);
    }
    const tax_rate = GIFT_TAX_RATE(year);
    taxes_owed = taxable * (tax_rate ?? 0);
  }

  return new AnnualGiftSummary(
    year,
    totalGifts,
    excessesOverLimit,
    taxes_owed,
    appliedLifetimeLimit,
    taxable,
    deductionForStateTaxesOnDeath ?? 0
  );
}
