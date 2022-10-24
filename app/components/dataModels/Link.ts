import { JsonObject, JsonProperty } from "typescript-json-serializer";
import type { ValueType } from "./utilities";
import { valueTypeDiscriminatorFn } from "./utilities";
import { AssetHolder, GoDate } from "./utilities";

export enum LinkType {
  Transfer = "transfer",
  OnDeath = "onDeath",
}

export type LinkTypesUnion = Transfer;

export function isTransfer(node: Link): node is Transfer {
  return node.category === LinkType.Transfer;
}
export function isOnDeath(node: Link): node is OnDeath {
  return node.category === LinkType.OnDeath;
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
  @JsonProperty({ required: true }) category: LinkType = LinkType.Transfer;
}

@JsonObject()
export class Transfer extends Link {
  @JsonProperty() category: LinkType = LinkType.Transfer;
  @JsonProperty({
    type: (s) => GoDate,
  })
  date: GoDate | undefined;

  @JsonProperty() isGift: boolean | undefined;
  @JsonProperty() fixedValue: number | undefined;
}

@JsonObject()
export class OnDeath extends Link {
  @JsonProperty() category: LinkType = LinkType.OnDeath;
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
