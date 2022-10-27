import { JsonObject, JsonProperty } from "typescript-json-serializer";
import {
  calculateTaxFromTable,
  WASHINGTON_ESTATE_EXCLUSIONS,
  WASHINGTON_ESTATE_TAX_RATES,
} from "../constants";

@JsonObject()
export class WashingtonEstateTaxSummary {
  @JsonProperty() totalValueAtDeath: number = 0;
  @JsonProperty() maritalAndCharitableDeductions: number = 0;
  @JsonProperty() washingtonExclusionAmount: number = 0;
  @JsonProperty() qualifiedFarmAndWoodlandDeduction?: number = 0;
  @JsonProperty() washingtonTaxableEstate: number = 0;
  @JsonProperty() washingtonEstateTax: number = 0;
}

export function calculateWashingtonTaxes(
  totalValueAtDeath: number,
  maritalAndCharitableDeductions: number
): WashingtonEstateTaxSummary {
  const washingtonExclusionAmount =
    WASHINGTON_ESTATE_EXCLUSIONS(new Date().getFullYear()) ?? 0;

  const washingtonTaxableEstate = Math.max(
    0,
    totalValueAtDeath -
      maritalAndCharitableDeductions -
      washingtonExclusionAmount
  );

  const washingtonEstateTax = calculateTaxFromTable(
    washingtonTaxableEstate,
    WASHINGTON_ESTATE_TAX_RATES
  );
  return {
    totalValueAtDeath,
    maritalAndCharitableDeductions,
    washingtonExclusionAmount,
    washingtonTaxableEstate,
    washingtonEstateTax: washingtonEstateTax ?? 0,
  };
}
