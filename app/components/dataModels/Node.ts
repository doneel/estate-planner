import { JsonObject, JsonProperty } from "typescript-json-serializer";
import {
  calculateWashingtonTaxes,
  WashingtonEstateTaxSummary,
} from "./calculators/cashflows";
import type { Link, OnDeath } from "./Link";
import { isOnDeath } from "./Link";
import { isTransfer } from "./Link";
import type { ValueType } from "./utilities";
import { Fixed, Portion, processValues, Remainder } from "./utilities";
import { isPortion } from "./utilities";
import { isFixed, isRemainder } from "./utilities";

export enum NodeType {
  Owner = "Owner",
  Beneficiary = "Beneficiary",
  JointEstate = "JointEstate",
  Bands = "Bands",
  Trust = "Trust",
}

export enum FirstDeath {
  Husband = "Husband",
  Wife = "Wife",
}

export type NodeTypesUnion = Beneficiary | Owner | JointEstate | Bands | Trust;

export const nodeType = (node: Node) => {
  switch (node.category) {
    case NodeType.Owner:
      return Owner;
    case NodeType.Beneficiary:
      return Beneficiary;
    case NodeType.JointEstate:
      return JointEstate;
    case NodeType.Bands:
      return Bands;
    case NodeType.Trust:
      return Trust;
  }
};

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
): node is JointEstate {
  return node.category === NodeType.JointEstate;
}

export function isTrust(
  node: Node | Owner | Beneficiary | JointEstate
): node is Trust {
  return node.category === NodeType.Trust;
}

export function isAssetHolder(node: Node): node is AssetHolder {
  return "inflows" in Object.keys(node);
}

export interface ProcessesCashflows {
  processCashflows(inflows: number, outflows: Link[]): string[];
}

@JsonObject()
export class Node implements NodeInterface {
  @JsonProperty({ required: true }) key: string = "";
  // @ts-ignore
  @JsonProperty({ required: true }) category: NodeType;
  // @ts-ignore
  @JsonProperty() location: string;
  @JsonProperty() visible: boolean = true;
}

@JsonObject()
export class AssetHolder extends Node implements ProcessesCashflows {
  @JsonProperty() inflows: number = 0;
  @JsonProperty() remaining: number = 0;

  calculateCashflowValues(inflows: number, outflows: Link[]): number {
    return processValues(
      outflows
        .map((l) => l.value)
        .filter((v): v is ValueType => v !== undefined),
      inflows
    );
  }

  processCashflows(inflows: number, outflows: Link[]): string[] {
    this.inflows = inflows;
    const transferred = this.calculateCashflowValues(inflows, outflows);
    this.remaining = inflows - transferred;
    return outflows.map((l) => l.to);
  }
}

export interface TaxPayerInterface {
  washingtonTaxes: WashingtonEstateTaxSummary;
  isSpouseLink(link: Link): boolean;
}

export class TaxPayer extends AssetHolder implements TaxPayerInterface {
  isSpouseLink(link: Link): boolean {
    throw new Error("Method not implemented.");
  }
  @JsonProperty({ type: WashingtonEstateTaxSummary })
  // @ts-ignore
  washingtonTaxes: WashingtonEstateTaxSummary;

  calculateCashflowValues(inflows: number, outflows: Link[]): number {
    let currentTotal = inflows;
    this.washingtonTaxes = calculateWashingtonTaxes(inflows, outflows);
    const deductable = (l: Link) => l.charitable || this.isSpouseLink(l);

    const nonTaxableTotal = processValues(
      outflows
        .filter(deductable)
        .map((l) => l.value)
        .filter((v): v is ValueType => v !== undefined),
      inflows
    );
    currentTotal -= nonTaxableTotal;
    currentTotal -= this.washingtonTaxes.washingtonEstateTax;

    currentTotal -= processValues(
      outflows
        .filter((l) => !deductable(l))
        .map((l) => l.value)
        .filter((v): v is ValueType => v !== undefined),
      currentTotal
    );
    return currentTotal;
  }
}

@JsonObject()
export class BandItem {
  @JsonProperty({ required: true }) text: string = "";
}

@JsonObject()
export class Bands extends Node {
  @JsonProperty({ required: true }) key: string = "_BANDS";
  @JsonProperty({ required: true }) category: NodeType.Bands = NodeType.Bands;
  @JsonProperty({ type: BandItem }) itemArray: Array<BandItem> = [];
}

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
export class Owner extends TaxPayer implements OwnerInterface {
  @JsonProperty({ required: true }) category: NodeType.Owner = NodeType.Owner;
  @JsonProperty() birthYear: number | undefined;
  @JsonProperty({ type: AnnualGiftSummary })
  annualGiftSummaries: Array<AnnualGiftSummary> = [];

  @JsonProperty() expectedLifeSpan: number | undefined;

  public giftMap: GiftMap | undefined = {};

  /* A solo owner only exists when the other spouse has already died */
  isSpouseLink(link: Link): boolean {
    return false;
  }

  constructor(name: string, birthYear?: number, expectedLifeSpan?: number) {
    super();
    this.key = name;
    this.birthYear = birthYear;
    this.expectedLifeSpan = expectedLifeSpan;
  }
}

@JsonObject()
export class Beneficiary extends AssetHolder implements BeneficiaryInterface {
  @JsonProperty({ required: true }) category: NodeType.Beneficiary =
    NodeType.Beneficiary;
  @JsonProperty() birthYear: number | undefined;

  processCashflows(inflows: number, outflows: Link[]): string[] {
    this.inflows = inflows;
    return [];
  }
}

@JsonObject()
export class JointEstate extends TaxPayer {
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
  @JsonProperty() husbandRemainder: number = 0;
  @JsonProperty() wifeExtraValue: number = 0;
  @JsonProperty() wifeRemainder: number = 0;
  @JsonProperty() firstDeath: FirstDeath | undefined;

  /* A solo owner only exists when the other spouse has already died */
  isSpouseLink(link: Link): boolean {
    if (this.firstDeath === FirstDeath.Husband) {
      return link.to === this.wife.key;
    }
    return link.to === this.husband.key;
  }

  processCashflows(inflows: number, outflows: Link[]): string[] {
    const husbandOutflows = outflows.filter(
      (l) => l.fromPort === "husbandport"
    );
    let husbandTotal =
      this.commonPropertyValue / 2 + (this.husbandExtraValue || 0);

    this.husbandRemainder =
      husbandTotal -
      super.calculateCashflowValues(husbandTotal, husbandOutflows);

    const wifeOutflows = outflows.filter((l) => l.fromPort === "wifeport");
    let wifeTotal = this.commonPropertyValue / 2 + (this.wifeExtraValue || 0);
    this.wifeRemainder =
      wifeTotal - super.calculateCashflowValues(wifeTotal, wifeOutflows);

    return outflows.map((l) => l.to);
  }
}

@JsonObject()
export class Trust extends AssetHolder {
  @JsonProperty({ required: true }) category: NodeType.Trust = NodeType.Trust;

  @JsonProperty() name: string = "";
  @JsonProperty() trustees: string = "";
  @JsonProperty() notes: string = "";
}
