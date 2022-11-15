import * as go from "gojs";
import type { Transfer } from "../dataModels/Link";

export function updateTransferEntity(
  diagram: go.Diagram,
  transferEntity: go.Part,
  transferData: Partial<Transfer>
) {
  diagram?.startTransaction(`Update ${transferData}`);
  Object.entries(transferData).forEach(([key, value]) => {
    diagram.model.setDataProperty(transferEntity?.data, key, value);
  });
  /*
  diagram.model.setDataProperty(
    transferEntity?.data,
    "date",
    transferData.date?.value
  );
  */
  diagram?.commitTransaction(`Update ${transferData}`);
}
export const TransferDiagram = new go.Link({
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
      .bind("segmentOrientation", "linksSharingTarget", (count) =>
        count > 1 ? go.Link.OrientUpright : go.Link.None
      )
      .add(
        new go.Shape("RoundedRectangle", {
          stroke: "black",
          strokeWidth: 0,
          fill: "white",
          opacity: 0.75,
          //minSize: new go.Size(150, NaN),
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
              return isHighlighted ? 2 : 0;
            }).ofObject()
          )
      )
      .add(
        new go.Panel("Vertical", { margin: 4 })
          .add(
            new go.Panel("Horizontal")
              .add(
                new go.Picture("images/gift.svg", {
                  alignment: go.Spot.TopRight,
                  desiredSize: new go.Size(24, 24),
                  opacity: 0.4,
                })
              )
              .add(
                new go.TextBlock("", {
                  alignment: go.Spot.Left,
                  font: "12pt sans-serif",
                }).bind("text", "date", (d) => d.toLocaleDateString())
              )
          )
          .add(
            new go.Panel("Horizontal").add(
              new go.TextBlock("", {
                alignment: go.Spot.Left,
                font: "16pt bold sans-serif",
                stroke: "black",
              })
                .bind("text", "", (node) => node.value.description)
                .bind(
                  new go.Binding("stroke", "isHighlighted", (isHighlighted) => {
                    return isHighlighted ? "black" : "black";
                  }).ofObject()
                )
            )
          )
      )
  );
