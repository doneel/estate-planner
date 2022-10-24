import { JsonObject, JsonProperty } from "typescript-json-serializer";

@JsonObject()
export class GoDate {
  @JsonProperty() class: string = "";
  @JsonProperty() value: Date = new Date();

  constructor(date: Date) {
    this.value = date;
  }
}
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

export interface AssetHolder {
  growthRate: number;
  currentValue(date: Date | undefined): number;
  outFlows: []; //TODO
}

interface Value {
  value(assetHolder: AssetHolder, date: Date | undefined): number;
  description: string;
  expectedValue: number | undefined;
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

@JsonObject()
export class Fixed implements Value {
  @JsonProperty({}) type: ValueTypes = ValueTypes.Fixed;
  @JsonProperty({ required: true }) fixedValue: number = 0;

  public value: (assetHolder: AssetHolder, date: Date | undefined) => number =
    () => {
      return this.fixedValue;
    };

  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
}

@JsonObject()
export class Portion implements Value {
  @JsonProperty({}) type: ValueTypes = ValueTypes.Portion;
  @JsonProperty({ required: true }) portion: number = 0;

  public value: (assetHolder: AssetHolder, date: Date | undefined) => number = (
    assetHolder,
    date
  ) => {
    return assetHolder.currentValue(date) * this.portion;
  };
  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
}

@JsonObject()
export class Remainder implements Value {
  @JsonProperty({}) type: ValueTypes = ValueTypes.Remainder;
  public value: (assetHolder: AssetHolder, date: Date | undefined) => number = (
    assetHolder,
    date
  ) => {
    return assetHolder.currentValue(date);
  };
  @JsonProperty({}) description: string = "";
  @JsonProperty({}) expectedValue: number | undefined;
}
