import * as go from "gojs";
import type { Owner } from "../planSidebars/OwnerSidebar";

function addTransfer(e: go.InputEvent, button: go.GraphObject) {
  //@ts-ignore
  var node: go.Node = button.part.adornedPart;
  e.diagram.clearSelection();

  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = {
    category: "transfer",
    date: undefined,
    fixedValue: 0,
  };
  tool.startObject = node.port;

  //@ts-ignore
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
              click: addTransfer,
            },
            new go.TextBlock("Add transfer", { margin: 8 })
          )
        )
        .add(
          go.GraphObject.make(
            "Button",
            { margin: 8, click: addTransfer },
            new go.TextBlock("On death", { margin: 8 })
          )
        )
    ),
})
  .add(
    new go.Picture("images/person.svg", {
      desiredSize: new go.Size(180, 180),
    })
  )
  .add(
    new go.TextBlock("default", {
      stroke: "black",
      font: "bold 24pt sans-serif",
      editable: true,
    }).bind("text", "key")
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
