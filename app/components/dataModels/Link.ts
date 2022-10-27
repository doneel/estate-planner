import { JsonObject, JsonProperty } from "typescript-json-serializer";
import type { ValueType } from "./utilities";
import { ValueTypes } from "./utilities";
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
  @JsonProperty() key: string = "";
  @JsonProperty({ required: true }) from: string = "";
  @JsonProperty({ required: true }) to: string = "";
  @JsonProperty({ required: true }) fromPort: string = "";
  @JsonProperty({ required: true }) toPort: string = "";

  @JsonProperty({ type: valueTypeDiscriminatorFn }) value: ValueType;

  // @ts-ignore
  @JsonProperty({ required: true }) category: LinkType;

  @JsonProperty() linksSharingTarget: number = 0;
  @JsonProperty() charitable: boolean = false;
}

@JsonObject()
export class Transfer extends Link implements LinkInterface {
  @JsonProperty() category: LinkType.Transfer = LinkType.Transfer;
  @JsonProperty({
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
  // @ts-ignore
  date: Date;

  @JsonProperty() isGift: boolean | undefined;
  //@JsonProperty({ type: Fixed }) value: Fixed;
  @JsonProperty() fixedValue: number | undefined;
  /*
  constructor(
    to: string,
    from: string,
    fromPort: string,
    toPort: string,
    isGift: boolean,
    fixedValue: number
  ) {
    super();
    this.category = LinkType.Transfer;
    //this.key = randomUUID();
    this.to = to;
    this.from = from;
    this.fromPort = fromPort;
    this.toPort = toPort;
    this.isGift = isGift;
    this.fixedValue = fixedValue;
  }
  */
}

@JsonObject()
export class OnDeath extends Link implements OnDeathInterface {
  @JsonProperty() category: LinkType.OnDeath = LinkType.OnDeath;
  @JsonProperty() personKey: string | undefined;
  /*
  constructor(
    to: string,
    from: string,
    fromPort: string,
    toPort: string,
    personKey: string,
    value: ValueType
  ) {
    super();
    this.category = LinkType.OnDeath;
    this.to = to;
    this.from = from;
    this.fromPort = fromPort;
    this.toPort = toPort;
    this.personKey = personKey;
    this.value = value;
  }
*/
  public static archetypeLinkData(personKey: string) {
    return {
      key: self.crypto.randomUUID(),
      category: LinkType.OnDeath,
      personKey: personKey,
      value: {
        type: ValueTypes.Fixed,
        fixedValue: 0,
      },
    };
  }
}
