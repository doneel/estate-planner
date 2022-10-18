import * as go from "gojs";

export const TransferEntity = new go.Link({
  fromEndSegmentLength: 60,
  toEndSegmentLength: 60,
  //routing: go.Link.AvoidsNodes,
  curve: go.Link.Bezier,
  //routing: go.Link.Bezier,
  //corner: 12,
  relinkableFrom: true,
  relinkableTo: true,
  selectionAdorned: true,
  reshapable: true,
})
  .add(new go.Shape({ strokeWidth: 2 }))
  .add(new go.Shape({ toArrow: "Standard" }))
  .add(
    new go.Panel("Auto")
      .add(
        new go.Shape("RoundedRectangle", {
          stroke: "black",
          fill: "lightgray",
          opacity: 0.8,
        })
      )
      .add(
        new go.Panel("Vertical", { margin: 12 }).add(
          new go.TextBlock("").bind("text", "when"),
          new go.TextBlock("").bind("text", "valueType"),
          new go.TextBlock("").bind("text", "estimatedValue")
        )
      )
  );
