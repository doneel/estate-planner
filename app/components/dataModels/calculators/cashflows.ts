import type { Link } from "../Link";
import type { Node } from "../Node";
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
    return { children };
  } else if (isOwner(node)) {
    const calculatedInflows = links
      .filter((l) => l.to === node.key)
      .map((link) => link.calculatedValue)
      .reduce((sum, n) => sum + n, 0);
    const children = node.processCashflows(calculatedInflows, outflows);
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

export function calculateCashflows(
  root: Node,
  nodes: Node[],
  allLinks: Link[]
) {
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
