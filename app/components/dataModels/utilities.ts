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

export interface AssetHolder {
  key: string;
  //growthRate: number;
  currentValue(date: Date | undefined): number;
  //outFlows: []; //TODO
}

interface Value {
  value(assetHolder: AssetHolder, date: Date | undefined): number;
  generateDescription(assetHolder: AssetHolder, date: Date | undefined): void;
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
  generateDescription(assetHolder: AssetHolder, date: Date | undefined): void {
    this.description = `$${withSuffix(this.value(assetHolder, date))}`;
  }
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
  generateDescription(assetHolder: AssetHolder, date: Date | undefined): void {
    this.description = `${this.portion * 100}% of ${
      assetHolder.key
    } ($${withSuffix(this.value(assetHolder, date))})`;
  }
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
  generateDescription(assetHolder: AssetHolder, date: Date | undefined): void {
    this.description = `Remainder of ${assetHolder.key} ($${withSuffix(
      this.value(assetHolder, date)
    )})`;
  }
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
