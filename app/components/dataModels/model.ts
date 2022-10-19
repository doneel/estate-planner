import {
  JsonObject,
  JsonProperty,
  JsonSerializer,
  throwError,
} from "typescript-json-serializer";
import { DefaultSerializer } from "v8";

export enum NodeType {
  Owner = "Owner",
  Beneficiary = "Beneficiary",
}

export type NodeTypesUnion = Beneficiary | Owner;

export enum LinkType {
  Transfer = "transfer",
}

@JsonObject()
export class Node {
  @JsonProperty({ required: true }) key: string;
  @JsonProperty() category: NodeType;
}

@JsonObject()
export class Beneficiary extends Node {
  @JsonProperty() birthYear: number;
}

@JsonObject()
export class Owner extends Node {
  @JsonProperty() birthYear: number;
  @JsonProperty() netWorth: number;
}

const nodeType = (node: Node): NodeTypesUnion => {
  switch (node.category) {
    case NodeType.Owner:
      return Owner;
    case NodeType.Beneficiary:
      return Beneficiary;
  }
};

@JsonObject()
export class Model {
  @JsonProperty({ name: "class" }) class: string = "";
  /*
  @JsonProperty({ type: nodeType })
  nodeDataArray: Array<Node>;
  */
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
