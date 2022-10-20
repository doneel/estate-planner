import { JsonObject, JsonProperty } from "typescript-json-serializer";

@JsonObject()
export class GoDate {
  @JsonProperty() class: string;
  @JsonProperty()
  value: Date;
}
