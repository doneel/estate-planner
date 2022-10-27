import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { i } from "vitest/dist/index-6e18a03a";
import {
  WASHINGTON_ESTATE_EXCLUSIONS,
  WASHINGTON_ESTATE_TAX_RATES,
} from "../constants";
import type { Link } from "../Link";
import { isTransfer } from "../Link";
import type { JointEstate, Node, Owner } from "../Node";
import { FirstDeath } from "../Node";
import { isTrust } from "../Node";
import { isOwner } from "../Node";
import { isJointEstate } from "../Node";

interface InflowsMap {
  [key: string]: number;
}

export type ProcessNodeResults = {
  children: string[];
  //inflowsMap: InflowsMap;
  //linkValues: LinkValues;
};

interface CashflowResults {
  [key: string]: { totalFunding: number };
}

interface LinkValues {
  [key: string]: { computedValue: number; description: string };
}

export type CashflowsResults = {
  funding: CashflowResults;
  linkValues: LinkValues;
};

function processNode(node: Node, links: Link[]): ProcessNodeResults {
  const outflows = links.filter((l) => l.from === node.key);
  if (isJointEstate(node)) {
    const children = node.processCashflows(0, outflows);
    node.washingtonTaxes = calculateWashingtonTaxesJointEstate(node, outflows);
    return { children };
  } else if (isOwner(node)) {
    const calculatedInflows = links
      .filter((l) => l.to === node.key)
      .map((link) => link.calculatedValue)
      .reduce((sum, n) => sum + n, 0);
    const children = node.processCashflows(calculatedInflows, outflows);
    node.washingtonTaxes = calculateWashingTaxesOwner(node, outflows);
    return { children };
  } else if (isTrust(node)) {
    const calculatedInflows = links
      .filter((l) => l.to === node.key)
      .map((link) => link.calculatedValue)
      .reduce((sum, n) => sum + n, 0);
    const children = node.processCashflows(calculatedInflows, outflows);
    return { children };
  }
  return { children: [] };
}

function removeHiddenNodes(nodes: Node[], allLinks: Link[]): [Node[], Link[]] {
  const hiddenNodeKeys = nodes
    .filter((node) => node.visible === false)
    .map((node) => node.key);

  return [
    nodes.filter((n) => !hiddenNodeKeys.includes(n.key)),
    allLinks.filter(
      (l) => !hiddenNodeKeys.includes(l.to) && !hiddenNodeKeys.includes(l.from)
    ),
  ];
}

export function calculateCashflows(
  root: Node,
  nodes: Node[],
  allLinks: Link[]
) {
  [nodes, allLinks] = removeHiddenNodes(nodes, allLinks);
  let remainingToProcess: string[] = [];
  const { children } = processNode(root, allLinks);
  remainingToProcess = remainingToProcess.concat(children);

  while (remainingToProcess.length > 0) {
    const keyInProcess = remainingToProcess.pop();
    const nodeInProcess = nodes.find((n) => n.key === keyInProcess);

    if (nodeInProcess) {
      const { children } = processNode(nodeInProcess, allLinks);
      remainingToProcess = remainingToProcess.concat(children);
    }
  }
}

@JsonObject()
export class WashingtonEstateTaxSummary {
  @JsonProperty() totalValueAtDeath: number = 0;
  @JsonProperty() maritalAndCharitableDeductions: number = 0;
  @JsonProperty() washingtonExclusionAmount: number = 0;
  @JsonProperty() qualifiedFarmAndWoodlandDeduction?: number = 0;
  @JsonProperty() washingtonTaxableEstate: number = 0;
  @JsonProperty() washingtonEstateTax: number = 0;
}

function calculateWashingtonTaxes(
  totalValueAtDeath: number,
  outflows: Link[],
  spouseKey?: string
): WashingtonEstateTaxSummary {
  const maritalFlows = outflows
    .filter((l) => spouseKey !== undefined && l.to === spouseKey)
    .map((l) => l.calculatedValue)
    .reduce((a, b) => a + b, 0);

  const charitableFlows = outflows
    .filter(isTransfer)
    .filter((t) => t.isGift === false)
    .map((l) => l.calculatedValue)
    .reduce((a, b) => a + b, 0);

  const washingtonExclusionAmount =
    WASHINGTON_ESTATE_EXCLUSIONS(new Date().getFullYear()) ?? 0;

  const washingtonTaxableEstate = Math.max(
    0,
    totalValueAtDeath -
      maritalFlows -
      charitableFlows -
      washingtonExclusionAmount
  );

  const washingtonEstateTax = calculateTaxFromTable(
    washingtonTaxableEstate,
    WASHINGTON_ESTATE_TAX_RATES
  );
  return {
    totalValueAtDeath,
    maritalAndCharitableDeductions: maritalFlows + charitableFlows,
    washingtonExclusionAmount,
    washingtonTaxableEstate,
    washingtonEstateTax: washingtonEstateTax ?? 0,
  };
}

export function calculateWashingtonTaxesJointEstate(
  node: JointEstate,
  outflows: Link[]
): WashingtonEstateTaxSummary {
  const portOfDeadSpouse = FirstDeath.Husband ? "husbandport" : "wifeport";
  const outflowsWhoDied = outflows.filter(
    (l) => l.fromPort === portOfDeadSpouse
  );
  const spouse =
    node.firstDeath === FirstDeath.Husband ? node.wife : node.husband;
  const personExtraValue =
    node.firstDeath === FirstDeath.Husband
      ? node.husbandExtraValue
      : node.wifeExtraValue;
  const totalValueAtDeath =
    node.commonPropertyValue / 2 + (personExtraValue ?? 0);

  return calculateWashingtonTaxes(
    totalValueAtDeath,
    outflowsWhoDied,
    spouse.key
  );
}

export function calculateWashingTaxesOwner(
  node: Owner,
  outflows: Link[]
): WashingtonEstateTaxSummary {
  return calculateWashingtonTaxes(node.inflows, outflows);
}

function calculateTaxFromTable(
  amount: number,
  taxTable: { [max: number]: number }
): number | undefined {
  let tax = 0;
  let lastBracketLimit = 0;

  Object.entries(taxTable).forEach(([limitString, rate]) => {
    const limit = Number(limitString);
    if (amount > limit) {
      const amountInRange = limit - lastBracketLimit;
      tax += amountInRange * rate;
      lastBracketLimit = limit;
    } else {
      tax += Math.max(0, amount - lastBracketLimit) * rate;
      lastBracketLimit = limit;
      return;
    }
  });
  return tax;
}
