import * as go from "gojs";
import type { ValueType } from "../dataModels/utilities";

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
  //curve: go.Link.Bezier,
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
          strokeWidth: 0,
          stroke: "white",
          fill: "white",
          opacity: 1,
        }).bind(
          new go.Binding("opacity", "value", (value) => {
            return value.description === undefined ? 0 : 1;
          })
        )
      )
      .add(
        new go.Panel("Vertical", { margin: 4, alignment: go.Spot.Left }).add(
          new go.TextBlock("", {
            alignment: go.Spot.Left,
            font: "16pt bold sans-serif",
          })
            .bind("text", "", (node) => node.value.description)
            .bind(
              new go.Binding("stroke", "isHighlighted", (isHighlighted) => {
                return isHighlighted ? "blue" : "black";
              }).ofObject()
            )
        )
      )
  );
