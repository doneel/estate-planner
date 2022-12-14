import * as go from "gojs";
import { OnDeath, Transfer } from "../dataModels/Link";
import type { Owner } from "../dataModels/Node";
import { withSuffix } from "../dataModels/utilities";

function addTransfer(e: go.InputEvent, button: go.GraphObject) {
  //@ts-ignore
  var node: go.Node = button.part.adornedPart;
  e.diagram.clearSelection();
  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = Transfer.archetypeLinkData();
  tool.startObject = node.port;

  //@ts-ignore
  node.diagram.currentTool = tool;
  tool.doActivate();
}

function onDeath(e: go.InputEvent, button: go.GraphObject) {
  //@ts-ignore
  var node: go.Node = button.part.adornedPart;
  e.diagram.clearSelection();

  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = OnDeath.archetypeLinkData(node.data.key);
  tool.startObject = node.findPort("out");

  //@ts-ignore
  node.diagram.currentTool = tool;
  tool.doActivate();
}

export function updateOwnerEntity(
  diagram: go.Diagram,
  ownerEntity: go.Part,
  owner: Partial<Owner>
) {
  diagram?.startTransaction(`Update ${owner.key}`);
  /* Update the joint estate */
  const jointEstateData = diagram.findNodeForKey("JointEstate")?.data;
  if (jointEstateData.husband.key === ownerEntity.key) {
    diagram.model.setDataProperty(jointEstateData.husband, "key", owner.key);
  } else if (jointEstateData.wife.key === ownerEntity.key) {
    diagram.model.setDataProperty(jointEstateData.wife, "key", owner.key);
  }

  /* Update self */
  Object.entries(owner).forEach(([key, value]) => {
    diagram.model.setDataProperty(ownerEntity?.data, key, value);
  });
  diagram?.commitTransaction(`Update ${owner.key}`);
}

export const OwnerDiagram = new go.Node("Vertical", {
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
            new go.TextBlock("Add Gift", { margin: 8 })
          )
        )
        .add(
          go.GraphObject.make(
            "Button",
            { margin: 8, click: onDeath },
            new go.TextBlock("On death", { margin: 8 })
          )
        )
    ),
})
  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  )
  .bind(new go.Binding("visible", "visible"))
  .add(
    new go.Shape("Circle", {
      name: "inport",
      fill: "white",
      stroke: "gray",
      desiredSize: new go.Size(20, 20),
      portId: "in",
      toLinkable: true,
      toLinkableDuplicates: true,
      mouseEnter: (e, port: go.GraphObject) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        if (!e.diagram.isReadOnly) shapePort.fill = "#66F";
        shapePort.toLinkable = false;
      },
      mouseLeave: (e, port) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        shapePort.fill = "white";
        shapePort.toLinkable = true;
      },
    })
  )
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
    }).bind(
      "text",
      "",
      (o) => `${o.key} ${o.inflows ? "($" + withSuffix(o.inflows) + ")" : ""}`
    )
  )
  .add(
    new go.TextBlock("", {
      alignment: go.Spot.Left,
      isMultiline: true,
      textAlign: "center",
      font: "bold 12pt sans-serif",
      stroke: "black",
      stretch: go.GraphObject.Horizontal,
      margin: new go.Margin(8, 0, 0, 0),
    }).bind("text", "", (n) =>
      n.remaining !== undefined ? `($${withSuffix(n.remaining)} remaining)` : ""
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
        shapePort.fromLinkable = false;
      },
      mouseLeave: (e, port) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        shapePort.fill = "gray";
        shapePort.fromLinkable = true;
      },
    })
  );
