import { JsonObject, JsonProperty } from "typescript-json-serializer";
import type { ValueType } from "./utilities";
import { valueTypeDiscriminatorFn } from "./utilities";

export enum LinkType {
  Transfer = "transfer",
  OnDeath = "onDeath",
}

export type LinkTypesUnion = Transfer | OnDeath;

export function isTransfer(node: Link): node is Transfer {
  return node.category === LinkType.Transfer;
}
export function isOnDeath(node: Link): node is OnDeath {
  return node.category === LinkType.OnDeath;
}

export interface LinkInterface {
  category: LinkType;
}

export interface TransferInterface {
  category: LinkType.Transfer;
}

export interface OnDeathInterface {
  category: LinkType.OnDeath;
}

export const linkTypeDiscriminatorFn = (link: Link) => {
  switch (link.category) {
    case LinkType.Transfer:
      return Transfer;
    case LinkType.OnDeath:
      return OnDeath;
  }
};

@JsonObject()
export class Link {
  @JsonProperty({ required: true }) from: string = "";
  @JsonProperty({ required: true }) to: string = "";

  // @ts-ignore
  @JsonProperty({ required: true }) category: LinkType;
}

@JsonObject()
export class Transfer extends Link implements LinkInterface {
  @JsonProperty() category: LinkType.Transfer = LinkType.Transfer;
  @JsonProperty({
    //type: (s) => GoDate,
    beforeDeserialize: (prop, currentInstance) => {
      if (prop instanceof Date) {
        return prop.toISOString();
      }
      return prop.value;
    },
    afterSerialize: (prop, currentInstance) => {
      return { class: "Date", value: prop };
    },
  })
  date: Date | undefined;

  @JsonProperty() isGift: boolean | undefined;
  @JsonProperty({
    afterSerialize: (value) => {
      return value + 1;
    },
    beforeSerialize: (value) => {
      return value + 2;
    },
  })
  fixedValue: number | undefined;
}

@JsonObject()
export class OnDeath extends Link implements OnDeathInterface {
  @JsonProperty() category: LinkType.OnDeath = LinkType.OnDeath;
  @JsonProperty() personKey: string | undefined;
  @JsonProperty({ type: valueTypeDiscriminatorFn }) value:
    | ValueType
    | undefined;

  /*
  //TODO
  public date: () => Date | undefined = () => {
    return
  }
  */
}
