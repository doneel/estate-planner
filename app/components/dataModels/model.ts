import {
  JsonObject,
  JsonProperty,
  JsonSerializer,
  throwError,
} from "typescript-json-serializer";
import type { Link, Transfer } from "./Link";
import { LinkTypesUnion } from "./Link";
import { LinkType } from "./Link";
import { linkType } from "./Link";
import type { Node } from "./Node";
import { nodeType } from "./Node";

@JsonObject()
export class GoDate {
  @JsonProperty() class: string = "Date";
  @JsonProperty() value: Date;
}

type Event = {
  parent: Link;
  date: Date;
  value: number;
};

@JsonObject()
export class Model {
  @JsonProperty() class: string;

  @JsonProperty({ type: nodeType })
  nodeDataArray: Array<Node>;

  @JsonProperty({ type: linkType })
  linkDataArray: Array<Link>;

  @JsonProperty()
  linkToPortIdProperty: string;

  @JsonProperty()
  linkFromPortIdProperty: string;

  public calculateAll() {
    this.nodeDataArray.forEach((n) => (n.newField = "yes"));
  }

  private getAllEvents(): Event[] {
    return this.linkDataArray
      .flatMap((link) => {
        switch (link.category) {
          case LinkType.Transfer:
            // @ts-ignore
            const transfer: Transfer = link;
            return [
              {
                parent: transfer,
                date: transfer.date,
                value: transfer.fixedValue,
              },
            ];
        }
      })
      .sort((e1, e2) => e2.date - e1.date);
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
