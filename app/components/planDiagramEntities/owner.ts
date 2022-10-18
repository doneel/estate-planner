import * as go from "gojs";
import type { Owner } from "../planForms/OwnerForm";

function addGift(e: go.InputEvent, button: go.GraphObject) {
  var node: go.Part = button.part.adornedPart;
  e.diagram.clearSelection();

  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = {
    fromPort: "OUT",
    toPort: "IN",
    category: "gift",
    when: "On death",
    valueType: "All remaining assets",
    estimatedValue: "49,000",
  };
  tool.startObject = node.findObject("outport");
  node.diagram.currentTool = tool;
  tool.doActivate();
}

export function updateOwnerEntity(
  diagram: go.Diagram,
  ownerEntity: go.Part,
  owner: Partial<Owner>
) {
  diagram?.startTransaction(`Update ${owner.name}`);
  Object.entries(owner).forEach(([key, value]) => {
    diagram.model.setDataProperty(ownerEntity?.data, key, value);
  });
  diagram.model.setDataProperty(ownerEntity?.data, "key", owner.name);
  diagram?.commitTransaction(`Update ${owner.name}`);
}

export const OwnerEntity = new go.Node("Vertical", {
  selectable: true,
  selectionAdornmentTemplate: new go.Adornment("Spot", {
    layerName: "Tool",
  })
    .add(new go.Placeholder({ padding: 10 }))
    .add(
      new go.Panel("Horizontal", {})
        .add(
          go.GraphObject.make(
            "Button",
            {
              margin: 8,
              click: addGift,
            },
            new go.TextBlock("Add gift", { margin: 8 })
          )
        )
        .add(
          go.GraphObject.make(
            "Button",
            { margin: 8, click: addGift },
            new go.TextBlock("On death", { margin: 8 })
          )
        )
    ),
})
  .add(
    new go.Shape("Circle", {
      fill: "gray",
      stroke: "white",
      desiredSize: new go.Size(12, 12),
      toLinkable: true,
      toSpot: go.Spot.TopSide,
      portId: "IN",
      mouseEnter: (e, port: go.GraphObject) => {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = "#66F";
      },
      mouseLeave: (e, port) => {
        port.fill = "gray";
      },
    })
  )
  .add(new go.Shape("Ellipse", { width: 120, height: 180, fill: "gray" }))
  .add(
    new go.TextBlock("default", {
      stroke: "red",
      font: "bold 24pt sans-serif",
      editable: true,
    }).bind("text", "key")
  )
  /*
        .add(
          new go.Panel("Horizontal")
            .add(
              go.GraphObject.make(
                "Button",
                { margin: 8, click: addPerson },
                new go.TextBlock("Add gift", { margin: 8 })
              )
            )
            .add(
              go.GraphObject.make(
                "Button",
                { margin: 8, click: addGift },
                new go.TextBlock("On death", { margin: 8 })
              )
            )
        )
        */
  .add(
    new go.Shape("Circle", {
      name: "outport",
      fill: "gray",
      stroke: "white",
      desiredSize: new go.Size(12, 12),
      fromLinkable: true,
      fromSpot: go.Spot.BottomSide,
      portId: "OUT",
      mouseEnter: (e, port: go.GraphObject) => {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = "#66F";
      },
      mouseLeave: (e, port) => {
        port.fill = "gray";
      },
    })
  );
