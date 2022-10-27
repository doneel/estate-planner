import { JsonObject, JsonProperty } from "typescript-json-serializer";

export function withSuffix(count: number): string {
  if (count < 1000) return "" + count;
  const exp = Math.trunc(Math.log(count) / Math.log(1000));

  return `${(count / Math.pow(1000, exp)).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}${"kMBTPE".charAt(exp - 1)}`;
}

export type Outflow = {
  date?: Date;
  value: Value;
};

@JsonObject()
export class Error {
  @JsonProperty({}) message: string = "";
}
interface Value {
  generateDescription(calculatedValue: number): void;
  description: string;
  expectedValue: number | undefined;
  errors: Error[];
}

export enum ValueTypes {
  Fixed = "fixed",
  Portion = "portion",
  Remainder = "remainder",
}
export type ValueType = Fixed | Portion | Remainder;

export const valueTypeDiscriminatorFn = (value: ValueType) => {
  switch (value.type) {
    case ValueTypes.Fixed:
      return Fixed;
    case ValueTypes.Portion:
      return Portion;
    case ValueTypes.Remainder:
      return Remainder;
  }
};

export function isFixed(value?: ValueType): value is Fixed {
  return value?.type === ValueTypes.Fixed;
}
export function isPortion(value?: ValueType): value is Portion {
  return value?.type === ValueTypes.Portion;
}
export function isRemainder(value?: ValueType): value is Remainder {
  return value?.type === ValueTypes.Remainder;
}

@JsonObject()
export class Fixed implements Value {
  generateDescription(calculatedValue: number): void {
    this.description = `$${withSuffix(calculatedValue)}`;
  }
  @JsonProperty({}) type: ValueTypes = ValueTypes.Fixed;
  @JsonProperty({ required: true }) fixedValue: number = 0;

  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
  @JsonProperty({ type: Error }) errors: Array<Error> = [];
}

@JsonObject()
export class Portion implements Value {
  generateDescription(calculatedValue: number): void {
    this.description = `${this.portion * 100}% ($${withSuffix(
      calculatedValue
    )})`;
  }
  @JsonProperty({}) type: ValueTypes = ValueTypes.Portion;
  @JsonProperty({ required: true }) portion: number = 0;

  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
  @JsonProperty({ type: Error }) errors: Array<Error> = [];
}

@JsonObject()
export class Remainder implements Value {
  generateDescription(calculatedValue: number): void {
    this.description = `Remainder ($${withSuffix(calculatedValue)})`;
  }
  @JsonProperty({}) type: ValueTypes = ValueTypes.Remainder;
  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
  @JsonProperty({ type: Error }) errors: Array<Error> = [];
}

export const SUM: (previousValue: number, currentValue: number) => number = (
  total,
  next
) => total + next;

export function processValues(
  values: ValueType[],
  currentTotal: number
): number {
  /* FixedValues */
  values.filter(isFixed).forEach((fixed) => {
    currentTotal -= fixed.fixedValue;
    fixed.generateDescription(fixed.fixedValue);
    if (currentTotal < 0) {
      fixed.errors.push({
        message: "Not enough assets to cover this transfer.",
      });
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
