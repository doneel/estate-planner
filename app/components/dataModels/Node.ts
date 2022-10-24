import { JsonObject, JsonProperty } from "typescript-json-serializer";

export enum NodeType {
  Owner = "Owner",
  Beneficiary = "Beneficiary",
  JointEstate = "JointEstate",
}

export type NodeTypesUnion = Beneficiary | Owner | JointEstate;

export interface NodeInterface {
  category: NodeType;
}

export interface OwnerInterface {
  category: NodeType.Owner;
}

export interface BeneficiaryInterface {
  category: NodeType.Beneficiary;
}

export function isOwner(node: Node | Owner | Beneficiary): node is Owner {
  return node.category === NodeType.Owner;
}

export function isBeneficiary(node: Node | Owner | Beneficiary): node is Owner {
  return node.category === NodeType.Beneficiary;
}

export function isJointEstate(
  node: Node | Owner | Beneficiary | JointEstate
): node is Owner {
  return node.category === NodeType.JointEstate;
}

@JsonObject()
export class Node implements NodeInterface {
  @JsonProperty({ required: true }) key: string = "";
  @JsonProperty({ required: true }) category: NodeType = NodeType.Beneficiary;
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
export class Owner extends Node implements OwnerInterface {
  @JsonProperty({ required: true }) category: NodeType.Owner = NodeType.Owner;
  @JsonProperty() birthYear: number | undefined;
  @JsonProperty({ type: AnnualGiftSummary })
  annualGiftSummaries: Array<AnnualGiftSummary> = [];

  @JsonProperty() expectedLifeSpan: number | undefined;
  public giftMap: GiftMap | undefined = {};

  constructor(name: string) {
    super();
    this.key = name;
  }
}

@JsonObject()
export class Beneficiary extends Node implements BeneficiaryInterface {
  @JsonProperty({ required: true }) category: NodeType.Beneficiary =
    NodeType.Beneficiary;
  @JsonProperty() birthYear: number | undefined;
}

@JsonObject()
export class JointEstate extends Node {
  @JsonProperty({ required: true }) category: NodeType.JointEstate =
    NodeType.JointEstate;
  @JsonProperty({ type: Owner, required: true }) husband: Owner = new Owner(
    "Husband"
  );
  @JsonProperty({ type: Owner, required: true }) wife: Owner = new Owner(
    "Wife"
  );
  @JsonProperty() commonPropertyValue: number = 0;
  @JsonProperty() husbandExtraValue: number = 0;
  @JsonProperty() wifeExtraValue: number = 0;
}
