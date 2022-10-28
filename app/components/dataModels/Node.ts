import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { calculateFederalGiftTax } from "./calculators/federalGiftTax";
import { processValues } from "./calculators/linkValues";
import {
  calculateWashingtonTaxes,
  WashingtonEstateTaxSummary,
} from "./calculators/washington";
import type { Link } from "./Link";
import { isOnDeath } from "./Link";
import { isTransfer } from "./Link";
import type { ValueType } from "./utilities";
import { isFixed } from "./utilities";
import { SUM } from "./utilities";

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

export function isBands(
  node: Node | Owner | Beneficiary | JointEstate
): node is Bands {
  return node.category === NodeType.Bands;
}

export function isAssetHolder(node: Node): node is AssetHolder {
  return node.category !== NodeType.Bands;
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
    this.remaining = this.calculateCashflowValues(inflows, outflows);
    return outflows.map((l) => l.to);
  }
}

@JsonObject()
export class AnnualGiftSummary {
  constructor(
    year: number,
    totalGiftValue: number,
    minusAnnualExclusions: number,
    expectedTax: number,
    lifetimeExclusionUsed: number,
    taxableValue: number,
    stateEstateTaxDeduction: number
  ) {
    this.year = year;
    this.totalGiftValue = totalGiftValue;
    this.minusAnnualExclusions = minusAnnualExclusions;
    this.expectedTax = expectedTax;
    this.lifetimeExclusionUsed = lifetimeExclusionUsed;
    this.taxableValue = taxableValue;
    this.stateEstateTaxDeduction = stateEstateTaxDeduction;
  }
  @JsonProperty() year: number | undefined;
  @JsonProperty() totalGiftValue: number;
  @JsonProperty() minusAnnualExclusions: number;
  @JsonProperty() lifetimeExclusionUsed: number;
  @JsonProperty() stateEstateTaxDeduction: number;
  @JsonProperty() taxableValue: number;
  @JsonProperty() expectedTax: number;
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

  @JsonProperty({ type: AnnualGiftSummary })
  annualGiftSummaries: Array<AnnualGiftSummary> = [];

  calculateCashflowValues(
    inflows: number,
    outflows: Link[],
    saveTaxes: boolean = true
  ): number {
    const isDeductible = (l: Link) =>
      l.charitable === true || this.isSpouseLink(l);
    /* Desired amounts with no taxes */
    processValues(
      outflows
        .map((l) => l.value)
        .filter((v): v is ValueType => v !== undefined),
      inflows
    );
    const taxableTotalAtDeath = outflows
      .filter(isOnDeath)
      .filter((l) => !isDeductible(l))
      .map((l) => l.value.expectedValue ?? 0)
      .reduce(SUM, 0);

    const deductableTotal = outflows
      .filter((l) => isDeductible(l))
      .map((l) => l.value.expectedValue ?? 0)
      .reduce(SUM, 0);

    const washingtonTaxes = calculateWashingtonTaxes(inflows, deductableTotal);
    const annualGiftSummaries = calculateFederalGiftTax(
      outflows
        .filter((l) => !isDeductible(l))
        .map((l) => {
          return {
            date: isTransfer(l) ? l.date : undefined,
            to: l.to,
            expectedValue: l.value.expectedValue ?? 0,
          };
        }),
      washingtonTaxes.washingtonEstateTax
    );
    let giftTaxDueAtDeath = 0;
    let taxesDue = 0;
    if (saveTaxes) {
      this.washingtonTaxes = washingtonTaxes;
      this.annualGiftSummaries = annualGiftSummaries;
      giftTaxDueAtDeath =
        annualGiftSummaries.find((s) => s.year === undefined)?.expectedTax ?? 0;
      taxesDue = washingtonTaxes.washingtonEstateTax + giftTaxDueAtDeath;
    }

    let taxAccountedFor = 0;
    if (taxesDue > 0) {
      outflows
        .filter((l) => !isDeductible(l))
        .filter(isOnDeath)
        .filter((l) => !isFixed(l.value))
        .forEach((l) => {
          const portionOfAllTaxable =
            (l.value.expectedValue ?? 0) / taxableTotalAtDeath;
          const shareOfTaxBurden = portionOfAllTaxable * taxesDue;
          l.value.expectedValue && (l.value.expectedValue -= shareOfTaxBurden);
          l.value.expectedValue &&
            l.value.generateDescription(l.value.expectedValue);
          taxAccountedFor += shareOfTaxBurden;
        });
    }

    if (taxAccountedFor < washingtonTaxes.washingtonEstateTax) {
      console.error(
        `${this.key} can only pay ${taxAccountedFor} out of the required ${washingtonTaxes.washingtonEstateTax}.
        \nReduce fixed value gifts.`
      );
    }
    return (
      inflows -
      (outflows.map((l) => l.value.expectedValue ?? 0).reduce(SUM, 0) +
        washingtonTaxes.washingtonEstateTax +
        giftTaxDueAtDeath)
    );
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

    this.husbandRemainder = super.calculateCashflowValues(
      husbandTotal,
      husbandOutflows,
      this.firstDeath === FirstDeath.Husband
    );

    const wifeOutflows = outflows.filter((l) => l.fromPort === "wifeport");
    let wifeTotal = this.commonPropertyValue / 2 + (this.wifeExtraValue || 0);
    this.wifeRemainder = super.calculateCashflowValues(
      wifeTotal,
      wifeOutflows,
      this.firstDeath === FirstDeath.Wife
    );

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
