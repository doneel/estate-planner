import go, { Binding, Margin } from "gojs";
import { LinkType } from "../dataModels/Link";
import type { Trust } from "../dataModels/Node";
import { ValueTypes, withSuffix } from "../dataModels/utilities";

export function updateTrustEntity(
  diagram: go.Diagram,
  trustEntity: go.Part,
  updateParams: Partial<Trust>
) {
  try {
    diagram?.startTransaction(`Update ${trustEntity.key}`);
    Object.entries(updateParams).forEach(([key, value]) => {
      diagram.model.setDataProperty(trustEntity.data, key, value);
    });
  } finally {
    diagram?.commitTransaction(`Update ${trustEntity.name}`);
  }
}

function onDissolution(e: go.InputEvent, button: go.GraphObject) {
  //@ts-ignore
  var node: go.Node = button.part.adornedPart;
  e.diagram.clearSelection();

  var tool = e.diagram.toolManager.linkingTool;
  tool.archetypeLinkData = {
    category: LinkType.OnDeath,
    personKey: node.data.key,
    value: {
      type: ValueTypes.Fixed,
      fixedValue: 0,
    },
  };
  tool.startObject = node.findPort("out");

  //@ts-ignore
  node.diagram.currentTool = tool;
  tool.doActivate();
}

export const TrustDiagram = new go.Node("Vertical", {
  selectionAdornmentTemplate: new go.Adornment("Spot", {
    layerName: "Tool",
    alignment: go.Spot.Bottom,
  })
    .add(new go.Placeholder({ padding: 10 }))
    .add(
      go.GraphObject.make(
        "Button",
        {
          alignment: go.Spot.BottomCenter,
          click: onDissolution,
        },
        new go.TextBlock("On dissolution", { margin: 8 })
      )
    ),
})
  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  )
  .add(
    new go.Shape("Circle", {
      name: "inport",
      fill: "white",
      stroke: "gray",
      desiredSize: new go.Size(20, 20),
      portId: "in",
      toLinkable: true,
      toLinkableDuplicates: true,
      margin: 4,
      mouseEnter: (e, port: go.GraphObject) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        if (!e.diagram.isReadOnly) shapePort.fill = "#66F";
      },
      mouseLeave: (e, port) => {
        //@ts-ignore
        const shapePort: go.Shape = port;
        shapePort.fill = "white";
      },
    })
  )
  .add(
    new go.Panel("Auto", {})
      .add(
        new go.Shape("RoundedRectangle", {
          strokeWidth: 1,
          fill: "#f2f2f9",
        })
      )
      .add(
        new go.Panel("Vertical", { margin: 16, maxSize: new go.Size(500, NaN) })
          .add(
            new go.Panel("Horizontal", { stretch: go.GraphObject.Horizontal })
              .add(
                new go.Picture("images/trust.svg", {
                  alignment: go.Spot.TopLeft,
                  opacity: 0.4,
                  desiredSize: new go.Size(40, 40),
                })
              )
              .add(
                new go.Panel("Auto", {
                  stretch: go.GraphObject.Horizontal,
                  margin: new Margin(0, 8, 0, 8),
                })
                  .add(
                    new go.Shape("Rectangle", {
                      opacity: 0,
                      //minSize: new go.Size(300, NaN),
                    })
                  )
                  .add(
                    new go.TextBlock("", {
                      margin: new Margin(4, 0, 0, 0),
                      alignment: go.Spot.TopCenter,
                      maxSize: new go.Size(500 - 40, NaN),
                      font: "20pt sans-serif",
                    }).bind(
                      "text",
                      "",
                      (o) =>
                        `${o.key} ${
                          o.inflows ? "($" + withSuffix(o.inflows) + ")" : ""
                        }`
                    )
                  )
              )
          )
          .add(
            new go.Panel("Vertical", {
              margin: new Margin(16, 0, 0, 0),
              alignment: go.Spot.Left,
            }).add(
              new go.Panel("Horizontal", { alignment: go.Spot.Left })
                .add(
                  new go.TextBlock("Trustees: ", {
                    alignment: go.Spot.Left,
                    font: "bold 12pt sans-serif",
                    margin: new Margin(0, 16, 0, 0),
                  })
                )
                .add(
                  new go.TextBlock("", {
                    alignment: go.Spot.Left,
                    font: "12pt sans-serif",
                  }).bind("text", "trustees")
                )
            )
          )
          .add(
            new go.TextBlock("About", {
              margin: new Margin(16, 0, 16, 0),
              alignment: go.Spot.Left,
              font: "bold 12pt sans-serif",
              isMultiline: true,
              textAlign: "left",
            })
          )
          .add(
            new go.TextBlock("", {
              alignment: go.Spot.Left,
              font: "12pt sans-serif",
              isMultiline: true,
              margin: new Margin(0, 0, 0, 4),
              textAlign: "left",
            }).bind(new Binding("text", "notes"))
          )
          .add(
            new go.TextBlock("", {
              alignment: go.Spot.Left,
              isMultiline: true,
              textAlign: "left",
              font: "bold 12pt sans-serif",
              stroke: "black",
              stretch: go.GraphObject.Horizontal,
              margin: new go.Margin(8, 0, 0, 0),
            }).bind("text", "", (n) =>
              n.remaining && n.remaining !== n.inflows
                ? `($${withSuffix(n.remaining)} remaining)`
                : ""
            )
          )
      )
  )
  .add(
    new go.Shape("Circle", {
      name: "outport",
      fill: "gray",
      stroke: "white",
      margin: new go.Margin(4, 0, 0, 0),
      desiredSize: new go.Size(20, 20),
      portId: "out",
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
