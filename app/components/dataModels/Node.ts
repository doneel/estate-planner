import { JsonObject, JsonProperty } from "typescript-json-serializer";
import type { Link, OnDeath } from "./Link";
import { isOnDeath } from "./Link";
import { isTransfer } from "./Link";
import type { Fixed, Portion, Remainder, ValueType } from "./utilities";
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

@JsonObject()
export class Node implements NodeInterface {
  @JsonProperty({ required: true }) key: string = "";
  // @ts-ignore
  @JsonProperty({ required: true }) category: NodeType;
  // @ts-ignore
  @JsonProperty() location: string;
  @JsonProperty() visible: boolean = true;

  /* Process the individual links (generate their values) and calculate how much money remains. */
  processOutflows(outflows: Link[], startingTotal: number): number {
    let currentTotal = startingTotal;
    /* Gift Transfers */
    outflows.filter(isTransfer).forEach((transfer) => {
      currentTotal -= transfer?.fixedValue || 0;
      if (currentTotal < 0) {
        console.error(
          `${this.key} does not have enough assets to cover gift of ${transfer?.fixedValue} to ${transfer.to}`
        );
      }
    });
    const onDeathWithValues = outflows
      .filter(isOnDeath)
      .map<[OnDeath, ValueType | undefined]>((t) => [t, t.value]);

    /* Fixed Values */
    onDeathWithValues
      // @ts-ignore
      .filter<[OnDeath, Fixed]>(([t, v]) => isFixed(v))
      .forEach(([t, fixed]: [OnDeath, Fixed]) => {
        currentTotal -= fixed.fixedValue;
        if (currentTotal < 0) {
          console.error(
            `${this.key} does not have enough assets to cover gift of ${fixed.fixedValue} to ${t.to}`
          );
        }
        fixed.generateDescription(fixed.fixedValue);
        t.calculatedValue = fixed.fixedValue;
      });

    /* Portions */
    const portions = onDeathWithValues
      // @ts-ignore
      .filter<[OnDeath, Portion]>(([t, v]) => isPortion(v));
    if (
      portions
        .map(([t, portion]) => portion.portion)
        .reduce((a, b) => a + b, 0) > 1
    ) {
      console.error(
        `Portions allocated from ${this.key} add up to more than 100%`
      );
    }
    portions.forEach(([t, portion]: [OnDeath, Portion]) => {
      const calculatedValue = portion.portion * currentTotal;
      t.calculatedValue = calculatedValue;
      currentTotal -= calculatedValue;
      portion.generateDescription(calculatedValue);
    });

    /* Remainders */
    const remainders = onDeathWithValues
      // @ts-ignore
      .filter<[OnDeath, Remainder]>(([t, v]) => isRemainder(v));
    if (remainders.length > 1) {
      console.error(`Two remainders found from ${this.key}`);
    }
    remainders.slice(0, 1).forEach(([t, remainder]: [OnDeath, Remainder]) => {
      const calculatedValue = Math.max(0, currentTotal);
      currentTotal -= calculatedValue;
      remainder.generateDescription(calculatedValue);
      t.calculatedValue = calculatedValue;
    });
    remainders.slice(1).forEach(([t, remainder]: [OnDeath, Remainder]) => {
      const calculatedValue = 0;
      t.calculatedValue = calculatedValue;
      currentTotal -= calculatedValue;
      remainder.generateDescription(calculatedValue);
    });

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
export class Owner extends Node implements OwnerInterface {
  @JsonProperty({ required: true }) category: NodeType.Owner = NodeType.Owner;
  @JsonProperty() birthYear: number | undefined;
  @JsonProperty({ type: AnnualGiftSummary })
  annualGiftSummaries: Array<AnnualGiftSummary> = [];

  @JsonProperty() inflows: number = 0;
  @JsonProperty() remaining: number = 0;

  @JsonProperty() expectedLifeSpan: number | undefined;
  public giftMap: GiftMap | undefined = {};

  constructor(name: string, birthYear?: number, expectedLifeSpan?: number) {
    super();
    this.key = name;
    this.birthYear = birthYear;
    this.expectedLifeSpan = expectedLifeSpan;
  }

  processCashflows(inflows: number, outflows: Link[]): string[] {
    this.inflows = inflows;
    this.remaining = this.processOutflows(outflows, inflows);
    return outflows.map((l) => l.to);
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
  @JsonProperty() husbandRemainder: number = 0;
  @JsonProperty() wifeExtraValue: number = 0;
  @JsonProperty() wifeRemainder: number = 0;
  @JsonProperty() firstDeath: FirstDeath | undefined;

  processCashflows(inflows: number, outflows: Link[]): string[] {
    const husbandOutflows = outflows.filter(
      (l) => l.fromPort === "husbandport"
    );
    let husbandTotal =
      this.commonPropertyValue / 2 + (this.husbandExtraValue || 0);
    this.husbandRemainder = this.processOutflows(husbandOutflows, husbandTotal);

    const wifeOutflows = outflows.filter((l) => l.fromPort === "wifeport");
    let wifeTotal = this.commonPropertyValue / 2 + (this.wifeExtraValue || 0);
    this.wifeRemainder = this.processOutflows(wifeOutflows, wifeTotal);

    return outflows.map((l) => l.to);
  }
}

@JsonObject()
export class Trust extends Node {
  @JsonProperty({ required: true }) category: NodeType.Trust = NodeType.Trust;

  @JsonProperty() inflows: number = 0;
  @JsonProperty() remaining: number = 0;
  @JsonProperty() name: string = "";
  @JsonProperty() trustees: string = "";
  @JsonProperty() notes: string = "";

  processCashflows(inflows: number, outflows: Link[]): string[] {
    this.inflows = inflows;
    this.remaining = this.processOutflows(outflows, inflows);
    return outflows.map((l) => l.to);
  }
}
