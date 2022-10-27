import go from "gojs";
import {
  JsonObject,
  JsonProperty,
  JsonSerializer,
  throwError,
} from "typescript-json-serializer";
import { calculateCashflows } from "./calculators/cashflows";
import {
  ANNUAL_GIFT_EXCLUSIONS,
  GIFT_TAX_RATE,
  LIFETIME_GIFT_EXCLUSIONS,
} from "./constants";
import type { LinkTypesUnion } from "./Link";
import { OnDeath } from "./Link";
import { isOnDeath } from "./Link";
import { isTransfer, Transfer } from "./Link";
import { LinkType, linkTypeDiscriminatorFn } from "./Link";
import type { Node, NodeTypesUnion, RecipientMap } from "./Node";
import { Trust } from "./Node";
import { isTrust } from "./Node";
import { FirstDeath } from "./Node";
import { isJointEstate } from "./Node";
import { JointEstate } from "./Node";
import { Beneficiary, isBeneficiary } from "./Node";
import { isOwner, Owner } from "./Node";
import { AnnualGiftSummary } from "./Node";
import { NodeType } from "./Node";
import { nodeType } from "./Node";

type Event = {
  parent: LinkTypesUnion;
  from?: Node;
  to?: Node;
  date: Date;
  value: number;
};

@JsonObject()
export class Model {
  @JsonProperty() class: string = "";

  @JsonProperty({ type: nodeType })
  nodeDataArray: Array<NodeTypesUnion> = [];

  @JsonProperty({
    type: linkTypeDiscriminatorFn,
  })
  linkDataArray: Array<LinkTypesUnion> = [];

  @JsonProperty()
  linkToPortIdProperty: string | undefined;

  @JsonProperty()
  linkFromPortIdProperty: string | undefined;

  public sumUpGifts(allEvents: Event[]) {
    allEvents
      .filter((e) => isTransfer(e.parent))
      // @ts-ignore
      .filter((e) => e.parent.isGift)
      .forEach((event) => {
        switch (event.from?.category) {
          case NodeType.Owner:
            // @ts-ignore
            const owner: Owner = event.from;
            if (owner.giftMap === undefined) {
              owner.giftMap = {};
            }
            if (owner.giftMap[event.date.getFullYear()] === undefined) {
              owner.giftMap[event.date.getFullYear()] = {};
            }
            if (
              owner.giftMap[event.date.getFullYear()][event?.to?.key ?? ""] ===
              undefined
            ) {
              owner.giftMap[event.date.getFullYear()][event?.to?.key ?? ""] = 0;
            }
            owner.giftMap[event.date.getFullYear()][event?.to?.key ?? ""] +=
              event.value;
        }
      });
  }

  getRoot(): JointEstate | undefined {
    return this.nodeDataArray.find(isJointEstate);
  }

  public calculateGiftSummaries() {
    const nodes: NodeTypesUnion[] = this.nodeDataArray;
    const n = nodes[0];
    switch (n.category) {
      case NodeType.Beneficiary:
        break;
      case NodeType.Owner:
        break;
    }
    nodes.filter((n) => n.category === NodeType.Owner).map((n) => n);
    this.nodeDataArray.filter(isOwner).forEach((owner) => {
      let lifetimeExclusionUsed = 0;
      owner.annualGiftSummaries = Object.entries(owner.giftMap || {}).map(
        ([yearU, giftsByRecipientU]) => {
          const year: number = Number(yearU);
          const annualExclusion = ANNUAL_GIFT_EXCLUSIONS(year);
          const lifetimeExclusionAsOfThisYear = LIFETIME_GIFT_EXCLUSIONS(year);
          const giftsByRecipient: RecipientMap = giftsByRecipientU;
          const totalGifts = Object.values(giftsByRecipient).reduce(
            (sum: number, gift: number) => sum + gift,
            0
          );
          const excessOverLimit = annualExclusion
            ? Object.values(giftsByRecipient)
                .map((giftValue) => giftValue - annualExclusion)
                .filter((excess) => excess > 0)
                .reduce((sum, n) => sum + n, 0)
            : 0;
          let taxesOwed = 0;
          if (lifetimeExclusionAsOfThisYear) {
            const headroom =
              lifetimeExclusionAsOfThisYear - lifetimeExclusionUsed;
            const taxable = Math.max(excessOverLimit - headroom, 0);
            const tax_rate = GIFT_TAX_RATE(year);
            taxesOwed = taxable * (tax_rate ?? 0);
          }
          lifetimeExclusionUsed += excessOverLimit;
          return new AnnualGiftSummary(
            year,
            totalGifts,
            taxesOwed,
            lifetimeExclusionUsed
          );
        }
      );
    });
  }

  public calculateAll() {
    /*
    const allEvents = this.getAllEvents();
    this.sumUpGifts(allEvents);
    this.calculateGiftSummaries();
    */
    this.setOwnerVisibility();
    this.countIncomingLinks();
    const root = this.getRoot();
    root && calculateCashflows(root, this.nodeDataArray, this.linkDataArray);
  }

  private countIncomingLinks(): void {
    const incomingCounts: { [key: string]: number } = {};
    this.linkDataArray.forEach((l) =>
      incomingCounts[l.to]
        ? (incomingCounts[l.to] += 1)
        : (incomingCounts[l.to] = 1)
    );
    this.linkDataArray.forEach(
      (l) => (l.linksSharingTarget = incomingCounts[l.to] ?? 0)
    );
  }

  private setOwnerVisibility(): void {
    const jointEstate = this.getRoot();
    const husbandKey = this.getRoot()?.husband.key;

    this.nodeDataArray
      .filter(isOwner)
      .filter((o) => o.key === husbandKey)
      .forEach((husband) => {
        husband.visible = jointEstate?.firstDeath !== FirstDeath.Husband;
        return husband;
      });
    const wifeKey = this.getRoot()?.wife.key;
    const wife = this.nodeDataArray
      .filter(isOwner)
      .find((o) => o.key === wifeKey);
    if (wife) {
      wife.visible = jointEstate?.firstDeath !== FirstDeath.Wife;
    }
  }

  private getAllEvents(): Event[] {
    return this.linkDataArray
      .flatMap((link) => {
        switch (link.category) {
          case LinkType.Transfer:
            const transfer = link;
            if (transfer.date === undefined) {
              //HIGHLIGHT ERRORS HERE
              const empty: Event[] = [];
              return empty;
            }
            return {
              parent: transfer,
              from: this.nodeDataArray.find(
                (node) => node.key === transfer.from
              ),
              to: this.nodeDataArray.find((node) => node.key === transfer.to),
              date: transfer?.date,
              value: transfer.fixedValue ?? 0,
            };
        }
        return [];
      })
      .filter((e) => e !== undefined)
      .sort((e1, e2) => e1.date.getTime() - e2.date.getTime());
  }
}

export const defaultSerializer = new JsonSerializer({
  // Throw errors instead of logging
  errorCallback: throwError,

  // Allow all nullish values
  nullishPolicy: {
    undefined: "allow",
    null: "allow",
  },
});

export function deserializeNode(blob: any): NodeTypesUnion | undefined {
  let node:
    | NodeTypesUnion
    | Array<NodeTypesUnion | undefined | null>
    | undefined
    | null;
  if (isOwner(blob)) {
    node = defaultSerializer.deserialize(blob, Owner);
  } else if (isBeneficiary(blob)) {
    node = defaultSerializer.deserialize(blob, Beneficiary);
  } else if (isJointEstate(blob)) {
    node = defaultSerializer.deserialize(blob, JointEstate);
  } else if (isTrust(blob)) {
    node = defaultSerializer.deserialize(blob, Trust);
  }

  if (node === undefined || node === null || node instanceof Array) {
    console.error("Couldn't deserialize selected node data", blob);
    return undefined;
  }
  return node;
}

export function deserializeLink(blob: any): LinkTypesUnion | undefined {
  let link:
    | LinkTypesUnion
    | Array<LinkTypesUnion | undefined | null>
    | undefined
    | null;

  if (isTransfer(blob)) {
    link = defaultSerializer.deserialize(blob, Transfer);
  } else if (isOnDeath(blob)) {
    link = defaultSerializer.deserialize(blob, OnDeath);
  }

  if (link === undefined || link === null || link instanceof Array) {
    console.error("Couldn't deserialize selected node data", blob);
    return undefined;
  }
  return link;
}

export function recomputeDiagram(
  diagram: go.Diagram,
  saveDiagram?: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  diagram.links
    .filter((link) => link.data.key === undefined)
    .each((link) => {
      link.data.key = self.crypto.randomUUID();
    });
  const dataModel = defaultSerializer.deserialize(
    diagram.model.toJson(),
    Model
  );
  if (
    dataModel !== undefined &&
    dataModel !== null &&
    !(dataModel instanceof Array)
  ) {
    dataModel.calculateAll();
    const reserializedModel = JSON.stringify(
      defaultSerializer.serialize(dataModel)
    );
    diagram.model = go.Model.fromJson(reserializedModel);
    saveDiagram && saveDiagram(reserializedModel);
  }
}
