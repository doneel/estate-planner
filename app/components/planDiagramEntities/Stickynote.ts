import * as go from "gojs";

export const StickynoteDiagram = new go.Node("Auto", {
  selectable: true,
  //resizable: true,
  reshapable: false,
  isShadowed: true,
  desiredSize: new go.Size(250, 250),
  maxSize: new go.Size(350, 350),
  isLayoutPositioned: false,
})

  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  )
  .add(
    new go.Shape("Square", {
      strokeWidth: 0,
      fill: "#FEF6A3",
      shadowVisible: true,
    })
  )
  .add(
    new go.TextBlock("", {
      margin: 8,
      alignment: go.Spot.TopCenter,
      stroke: "gray",
      cursor: "text",
      font: "14pt sans-serif",
      editable: true,
      wrap: go.TextBlock.WrapBreakAll,
      overflow: go.TextBlock.OverflowEllipsis,
    }).bind(new go.Binding("text", "text").makeTwoWay())
  );
