import * as go from "gojs";

export const BandsDiagram = new go.Part("Position", {
  isLayoutPositioned: false, // but still in document bounds
  //locationSpot: new go.Spot(0, 0, 16, 0), // account for header height
  layerName: "Background",
  pickable: false,
  selectable: false,
  itemTemplate: new go.Panel("Vertical")
    .bind(new go.Binding("position", "bounds", (b) => b.position))
    .add(
      new go.Shape("LineH", {
        stroke: "gray",
        alignment: go.Spot.TopLeft,
        height: 1,
        margin: new go.Margin(10, 0, 0, 0),
      })
        .bind(new go.Binding("width", "bounds", (r) => r.width))
        .bind(new go.Binding("visible", "itemIndex", (i) => i > 0).ofObject())
    )
    .add(
      new go.Panel("Auto", {
        alignment: go.Spot.Center,
        margin: new go.Margin(-8, 4, 0, 4),
      })
        .add()
        .add(
          new go.TextBlock("", {
            font: "italic 12pt sans-serif",
            stroke: "gray",
            background: "white",
          }).bind("text", "text")
        )
    ),
})
  .bind(new go.Binding("itemArray"))
  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  );
