import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { GoDate } from "./utilities";

export enum LinkType {
  Transfer = "transfer",
}

export type LinkTypesUnion = Transfer;

export const linkTypeDiscriminatorFn = (link: Link) => {
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
  @JsonProperty({
    type: (s) => GoDate,
  })
  date: GoDate;
  @JsonProperty() isGift: boolean;
  @JsonProperty() fixedValue: number;
}
