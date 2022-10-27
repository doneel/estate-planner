import type { ValueType } from "../utilities";
import { isFixed, isPortion, isRemainder, SUM } from "../utilities";

export function processValues(
  values: ValueType[],
  currentTotal: number
): number {
  /* FixedValues */
  values.filter(isFixed).forEach((fixed) => {
    currentTotal -= fixed.fixedValue;
    fixed.generateDescription(fixed.fixedValue);
    if (currentTotal < 0) {
      console.log(fixed.errors);
      const error = {
        message: "Not enough assets to cover this transfer.",
      };
      fixed.errors ? fixed.errors.push(error) : (fixed.errors = [error]);
    }
    fixed.expectedValue = fixed.fixedValue;
  });

  /* Portions */
  const portionsSum = values
    .filter(isPortion)
    .map((p) => p.portion)
    .reduce(SUM, 0);
  values.filter(isPortion).forEach((p) => {
    p.expectedValue = p.portion * currentTotal;
    p.generateDescription(p.expectedValue);
  });
  currentTotal -= portionsSum * currentTotal;
  /*
  if (portionsSum > 1) {
    parentErrors.push({
      message: `Portions allocated add up to more than 100% (${
        portionsSum * 100
      })`,
    });
  }
  */

  /* Remainders */
  //TODO: Refactor to use the index to just get a different value
  values
    .filter(isRemainder)
    .slice(0, 1)
    .forEach((remainder) => {
      remainder.expectedValue = Math.max(0, currentTotal);
      currentTotal -= remainder.expectedValue;
      remainder.generateDescription(remainder.expectedValue);
    });
  values
    .filter(isRemainder)
    .slice(1)
    .forEach((remainder) => {
      remainder.expectedValue = 0;
      currentTotal -= remainder.expectedValue;
      remainder.generateDescription(remainder.expectedValue);
    });
  return currentTotal;
}
