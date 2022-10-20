import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { GoDate } from "./utilities";

export enum LinkType {
  Transfer = "transfer",
}

export type LinkTypesUnion = Transfer;

export function isTransfer(node: Link): node is Transfer {
  return node.category === LinkType.Transfer;
}

export const linkTypeDiscriminatorFn = (link: Link) => {
  switch (link.category) {
    case LinkType.Transfer:
      return Transfer;
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
