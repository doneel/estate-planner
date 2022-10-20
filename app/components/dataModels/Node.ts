import { JsonObject, JsonProperty } from "typescript-json-serializer";

export enum NodeType {
  Owner = "Owner",
  Beneficiary = "Beneficiary",
}

export type NodeTypesUnion = Beneficiary | Owner;

@JsonObject()
export class Node {
  @JsonProperty({ required: true }) key: string;
  @JsonProperty() category: NodeType;
  @JsonProperty() newField: string;
}

export const nodeType = (node: Node) => {
  switch (node.category) {
    case NodeType.Owner:
      return Owner;
    case NodeType.Beneficiary:
      return Beneficiary;
  }
};

@JsonObject()
export class AnnualGiftSummary {
  constructor(
    year: number,
    totalGiftValue: number,
    expectedTax: number,
    lifetimeExclusionUsed: number
  ) {
    this.year = year;
    this.totalGiftValue = totalGiftValue;
    this.expectedTax = expectedTax;
    this.lifetimeExclusionUsed = lifetimeExclusionUsed;
  }
  @JsonProperty() year: number;
  @JsonProperty() totalGiftValue: number;
  @JsonProperty() expectedTax: number;
  @JsonProperty() lifetimeExclusionUsed: number;
}

export interface RecipientMap {
  [to: string]: number;
}
export interface GiftMap {
  [year: number]: RecipientMap;
}

@JsonObject()
export class Owner extends Node {
  @JsonProperty() birthYear: number;
  @JsonProperty() netWorth: number;
  @JsonProperty({ type: AnnualGiftSummary })
  annualGiftSummaries: Array<AnnualGiftSummary>;

  @JsonProperty() expectedLifeSpan: number;
  public giftMap: GiftMap = {};
}

@JsonObject()
export class Beneficiary extends Node {
  @JsonProperty() birthYear: number;
}
