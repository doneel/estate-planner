import {
  JsonObject,
  JsonProperty,
  throwError,
} from "typescript-json-serializer";

export enum LinkType {
  Transfer = "transfer",
}

export type LinkTypesUnion = Transfer;

export const linkType = (link: Link) => {
  switch (link.category) {
    case LinkType.Transfer:
      return Transfer;
  }
};

@JsonObject()
export class Link {
  @JsonProperty() from: string;
  @JsonProperty() to: string;
  @JsonProperty() category: LinkType;
}

@JsonObject()
export class Transfer extends Link {
  @JsonProperty() category: LinkType = LinkType.Transfer;
  @JsonProperty() date: GoDate;
  @JsonProperty() isGift: boolean;
  @JsonProperty() fixedValue: number;
}
