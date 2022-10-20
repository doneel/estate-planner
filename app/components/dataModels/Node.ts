import { JsonObject, JsonProperty } from "typescript-json-serializer";

export enum NodeType {
  Owner = "Owner",
  Beneficiary = "Beneficiary",
}

export type NodeTypesUnion = Beneficiary | Owner;

@JsonObject()
export class Node {
  @JsonProperty({ required: true }) key: string;
  @JsonProperty() category: NodeType;
  @JsonProperty() newField: string;
}

export const nodeType = (node: Node) => {
  switch (node.category) {
    case NodeType.Owner:
      return Owner;
    case NodeType.Beneficiary:
      return Beneficiary;
  }
};

@JsonObject()
export class Owner extends Node {
  @JsonProperty() birthYear: number;
  @JsonProperty() netWorth: number;
}

@JsonObject()
export class Beneficiary extends Node {
  @JsonProperty() birthYear: number;
}
