import * as go from "gojs";
import type { OnDeath } from "../dataModels/Link";
import type { ValueType } from "../dataModels/utilities";
import { withSuffix } from "../dataModels/utilities";

export function updateOnDeathEntity(
  diagram: go.Diagram,
  onDeathDiagram: go.Part,
  updateParams: Partial<ValueType>
) {
  diagram?.startTransaction(`Update ${onDeathDiagram.data.to}`);
  Object.entries(updateParams).forEach(([key, value]) => {
    diagram.model.setDataProperty(onDeathDiagram?.data.value, `${key}`, value);
  });
  diagram?.commitTransaction(`Update ${onDeathDiagram.data.to}`);
}

export const OnDeathDiagram = new go.Link({
  fromEndSegmentLength: 60,
  toEndSegmentLength: 60,
  curve: go.Link.Bezier,
  relinkableFrom: true,
  relinkableTo: true,
  selectionAdorned: false,
  selectionChanged: (e: go.Part) => {
    e.isHighlighted = !e.isHighlighted;
  },
})

  .add(new go.Shape({ strokeWidth: 2 }))
  .add(new go.Shape({ toArrow: "Standard" }))
  .add(
    new go.Panel("Auto")
      .add(
        new go.Shape("RoundedRectangle", {
          stroke: "black",
          strokeWidth: 1,
          fill: "lightgray",
          opacity: 0.8,
          minSize: new go.Size(150, NaN),
        })
          .bind(
            new go.Binding("stroke", "isHighlighted", (isHighlighted) => {
              return isHighlighted ? "blue" : "black";
            }).ofObject()
          )
          .bind(
            new go.Binding("opacity", "isHighlighted", (isHighlighted) => {
              return isHighlighted ? 1 : 0.8;
            }).ofObject()
          )
          .bind(
            new go.Binding("strokeWidth", "isHighlighted", (isHighlighted) => {
              return isHighlighted ? 2 : 1;
            }).ofObject()
          )
      )
      .add(
        new go.Panel("Vertical", { margin: 4, alignment: go.Spot.Left }).add(
          new go.TextBlock("", {
            alignment: go.Spot.Left,
            font: "12pt sans-serif",
          }).bind("text", "description"),
          new go.TextBlock("", {
            font: "10pt sans-serif",
            alignment: go.Spot.Left,
          }).bind("text", "expectedValue", (v) =>
            v ? `($${withSuffix(v)})` : ""
          )
        )
      )
  );
