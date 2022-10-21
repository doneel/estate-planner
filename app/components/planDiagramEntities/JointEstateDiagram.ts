import * as go from "gojs";
import { withSuffix } from "../dataModels/utilities";
function onHusbandDeath(e: go.InputEvent, button: go.GraphObject) {
  console.log("trying to create on husband death");
  var node: go.Node = button.part.adornedPart;
  e.diagram.clearSelection();

  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = {
    category: "transfer",
    date: undefined,
    fixedValue: 0,
    isGift: true,
  };
  tool.startObject = node.port;

  //@ts-ignore
  node.diagram.currentTool = tool;
  tool.doActivate();
}

export const JointEstateDiagram = new go.Node("Vertical", {
  selectable: true,
  selectionAdornmentTemplate: new go.Adornment("Spot", {
    layerName: "Tool",
  })
    .add(new go.Placeholder({ padding: 10 }))
    .add(
      new go.Panel("Horizontal", {}).add(
        go.GraphObject.make(
          "Button",
          {
            margin: 8,
            click: onHusbandDeath,
          },
          new go.TextBlock("On husband's passing", { margin: 8 })
        )
      )
    ),
})
  .add(
    new go.Picture("images/couple.svg", {
      desiredSize: new go.Size(180, 180),
    })
  )
  .add(
    new go.TextBlock("default", {
      stroke: "black",
      font: "bold 24pt sans-serif",
      editable: true,
    }).bind(
      "text",
      "",
      (data, node) => `${data.wife.key} & ${data.husband.key}`
    )
  )
  .add(
    new go.TextBlock("Joint Estate", {
      stroke: "black",
      font: "bold 24pt sans-serif",
      editable: true,
    }).bind("text", "", (data, node) =>
      data.commonPropertyValue
        ? `(~${withSuffix(data.commonPropertyValue)})`
        : ""
    )
  )
  .add(
    new go.Shape("Circle", {
      name: "outport",
      fill: "gray",
      stroke: "white",
      desiredSize: new go.Size(20, 20),
      portId: "",
      fromLinkable: true,
      fromLinkableDuplicates: true,
      mouseEnter: (e, port: go.GraphObject) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        if (!e.diagram.isReadOnly) shapePort.fill = "#66F";
      },
      mouseLeave: (e, port) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        shapePort.fill = "gray";
      },
    })
  );
