import { JsonObject, JsonProperty } from "typescript-json-serializer";

@JsonObject()
export class GoDate {
  @JsonProperty() class: string = "";
  @JsonProperty() value: Date = new Date();
}
export function withSuffix(count: number): string {
  if (count < 1000) return "" + count;
  const exp = Math.trunc(Math.log(count) / Math.log(1000));

  return `${(count / Math.pow(1000, exp)).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })} ${"kMGTPE".charAt(exp - 1)}`;
}
