import {
  JsonObject,
  JsonProperty,
  JsonSerializer,
  throwError,
} from "typescript-json-serializer";
import { d } from "vitest/dist/index-6e18a03a";
import { ANNUAL_GIFT_EXCLUSIONS } from "./constants";
import type { Link, Transfer } from "./Link";
import { LinkType, linkTypeDiscriminatorFn } from "./Link";
import type { Node, Owner, RecipientMap } from "./Node";
import { AnnualGiftSummary } from "./Node";
import { NodeType } from "./Node";
import { nodeType } from "./Node";

type Event = {
  parent: Link;
  from?: Node;
  to?: Node;
  date: Date;
  value: number;
};

@JsonObject()
export class Model {
  @JsonProperty() class: string;

  @JsonProperty({ type: nodeType })
  nodeDataArray: Array<Node>;

  @JsonProperty({ type: linkTypeDiscriminatorFn })
  linkDataArray: Array<Link>;

  @JsonProperty()
  linkToPortIdProperty: string;

  @JsonProperty()
  linkFromPortIdProperty: string;

  public sumUpGifts(allEvents: Event[]) {
    allEvents.forEach((event) => {
      switch (event.from?.category) {
        case NodeType.Owner:
          // @ts-ignore
          const owner: Owner = event.from;
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

  public calculateGiftSummaries() {
    this.nodeDataArray
      .filter((n) => n.category === NodeType.Owner)
      .forEach((owner: Owner) => {
        const lifetimeExclusionUsed = 0;
        owner.annualGiftSummaries = Object.entries(owner.giftMap).map(
          ([yearU, giftsByRecipientU]) => {
            const year: number = yearU;
            const annualExclusion = ANNUAL_GIFT_EXCLUSIONS(year);
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
            console.log(
              new AnnualGiftSummary(year, totalGifts, 0, excessOverLimit)
            );
            return new AnnualGiftSummary(year, totalGifts, 0, excessOverLimit);
          }
        );
      });
  }

  public calculateAll() {
    const allEvents = this.getAllEvents();
    this.sumUpGifts(allEvents);
    this.calculateGiftSummaries();
    console.log(
      this.nodeDataArray
        .filter((n) => n.category === NodeType.Owner)
        .map((n) => n.annualGiftSummaries)
    );
  }

  private getAllEvents(): Event[] {
    return this.linkDataArray
      .flatMap((link) => {
        switch (link.category) {
          case LinkType.Transfer:
            // @ts-ignore
            const transfer: Transfer = link;
            //console.log(typeof transfer.date.value, transfer.date.value);
            return [
              {
                parent: transfer,
                from: this.nodeDataArray.find(
                  (node) => node.key === transfer.from
                ),
                to: this.nodeDataArray.find((node) => node.key === transfer.to),
                date: transfer.date.value,
                value: transfer.fixedValue,
              },
            ];
        }
      })
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
