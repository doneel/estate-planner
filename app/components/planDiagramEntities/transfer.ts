import * as go from "gojs";
import type { Transfer } from "../planSidebars/TransferSidebar";

export function updateTransferEntity(
  diagram: go.Diagram,
  transferEntity: go.Part,
  transferData: Partial<Transfer>
) {
  diagram?.startTransaction(`Update ${transferData}`);
  Object.entries(transferData).forEach(([key, value]) => {
    diagram.model.setDataProperty(transferEntity?.data, key, value);
  });
  diagram?.commitTransaction(`Update ${transferData}`);
}
export const TransferEntity = new go.Link({
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
        new go.Picture("images/gift.svg", {
          alignment: go.Spot.TopRight,
          desiredSize: new go.Size(24, 24),
          opacity: 0.4,
        }).bind("opacity", "isGift", (isGift) => (isGift ? 0.4 : 0))
      )
      .add(
        new go.Panel("Vertical", { margin: 4, alignment: go.Spot.Left }).add(
          new go.TextBlock("", {
            alignment: go.Spot.Left,
            font: "12pt sans-serif",
          }).bind("text", "date", (d) => d.toLocaleDateString()),
          new go.TextBlock("", {
            font: "10pt sans-serif",
            alignment: go.Spot.Left,
          }).bind("text", "fixedValue", (v) => `$${v.toLocaleString()}`),
          new go.TextBlock("", {
            alignment: go.Spot.Left,
            font: "10pt sans-serif",
          }).bind("text", "estimatedValue")
        )
      )
  );
