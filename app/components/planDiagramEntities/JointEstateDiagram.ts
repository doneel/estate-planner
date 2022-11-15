import * as go from "gojs";
import { OnDeath } from "../dataModels/Link";
import { withSuffix } from "../dataModels/utilities";
import type { JointEstateUpdateProps } from "../planForms/JointEstateForm";

export function updateJointEstateEntity(
  diagram: go.Diagram,
  jointEstateEntity: go.Part,
  updateParams: JointEstateUpdateProps
) {
  try {
    diagram?.startTransaction(`Update ${jointEstateEntity.key}`);
    const husbandDiagramEntity = diagram.findNodeForKey(
      jointEstateEntity.data.husband.key
    );
    const wifeDiagramEntity = diagram.findNodeForKey(
      jointEstateEntity.data.wife.key
    );

    if (updateParams.husbandName) {
      diagram.model.setDataProperty(
        husbandDiagramEntity?.data,
        "key",
        updateParams.husbandName
      );
      diagram.model.setDataProperty(
        jointEstateEntity.data.husband,
        "key",
        updateParams.husbandName
      );
    }
    if (updateParams.wifeName) {
      diagram.model.setDataProperty(
        wifeDiagramEntity?.data,
        "key",
        updateParams.wifeName
      );
      diagram.model.setDataProperty(
        jointEstateEntity.data.wife,
        "key",
        updateParams.wifeName
      );

      Object.entries(updateParams)
        .filter(([k, v]) => !["husbandName", "wifeName"].includes(k))
        .forEach(([key, value]) => {
          diagram.model.setDataProperty(jointEstateEntity.data, key, value);
        });
    }
  } finally {
    diagram?.commitTransaction(`Update ${jointEstateEntity.name}`);
  }
}

function makeGiftFromPort(partName: string) {
  return function (e: go.InputEvent, button: go.GraphObject) {
    //@ts-ignore
    var node: go.Node = button.part.adornedPart;
    e.diagram.clearSelection();

    var tool = e.diagram.toolManager.linkingTool;
    tool.archetypeLinkData = OnDeath.archetypeLinkData(node.data.husband.key);
    tool.startObject = node.findPort(partName);

    //@ts-ignore
    node.diagram.currentTool = tool;
    tool.doActivate();
  };
}

export const JointEstateDiagram = new go.Node("Vertical", {
  selectable: true,
  selectionAdornmentTemplate: new go.Adornment("Spot", {
    layerName: "Tool",
    alignment: go.Spot.Bottom,
  })
    .add(new go.Placeholder({ padding: 10 }))
    .add(
      go.GraphObject.make(
        "Button",
        {
          alignment: new go.Spot(0.26, 1.05),
          click: makeGiftFromPort("wifeport"),
        },
        new go.TextBlock("Move Assets", { margin: 8 })
      )
    )
    .add(
      go.GraphObject.make(
        "Button",
        {
          alignment: new go.Spot(0.74, 1.05),
          click: makeGiftFromPort("husbandport"),
        },
        new go.TextBlock("Move Assets", { margin: 8 })
      )
    ),
})
  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  )
  .add(
    new go.Picture("images/couple.svg", {
      desiredSize: new go.Size(180, 180),
    })
  )
  .add(
    new go.TextBlock("default", {
      stroke: "black",
      font: "bold 24pt sans-serif",
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
    }).bind("text", "", (data, node) =>
      data.commonPropertyValue
        ? `Joint Estate (~$${withSuffix(data.commonPropertyValue)})`
        : "Joint Estate"
    )
  )
  .add(
    new go.Panel("Auto", { margin: new go.Margin(16, 0, 0, 0) })
      .add(
        new go.Shape("RoundedRectangle", {
          strokeWidth: 0,
          fill: "#f2f2f9",
        })
      )
      .add(
        new go.Panel(go.Panel.Table, {
          margin: 16,
          defaultColumnSeparatorStroke: "gray",
          defaultColumnSeparatorStrokeWidth: 2,
          defaultColumnSeparatorDashArray: [2, 2],
          defaultRowSeparatorStroke: "gray",
          defaultRowSeparatorStrokeWidth: 12,
        })
          .add(
            new go.Panel("Horizontal", {
              column: 0,
              maxSize: new go.Size(550, NaN),
              margin: new go.Margin(0, 8, 0, 0),
            })
              .add(
                new go.Picture("images/coins.svg", {
                  alignment: go.Spot.TopLeft,
                  desiredSize: new go.Size(48, 48),
                  opacity: 0.4,
                  margin: 8,
                })
              )
              .add(
                new go.Panel("Vertical", {
                  margin: 8,
                  alignment: go.Spot.TopCenter,
                })
                  .add(
                    new go.TextBlock("Wife's share", {
                      font: "20pt sans-serif",
                      alignment: go.Spot.Left,
                    }).bind(
                      "text",
                      "",
                      (data, node) =>
                        `${data.wife.key}'s share ($${withSuffix(
                          data.commonPropertyValue / 2 +
                            (data.wifeExtraValue ?? 0)
                        )})`
                    )
                  )
                  .add(
                    new go.TextBlock(
                      "Including individual assets and half of shared assets",
                      {
                        font: "12pt sans-serif",
                        alignment: go.Spot.Left,
                        stroke: "gray",
                        width: 300,
                        wrap: go.TextBlock.WrapFit,
                      }
                    )
                  )
                  .add(
                    new go.TextBlock("", {
                      font: "12pt sans-serif",
                      stroke: "black",
                      stretch: go.GraphObject.Horizontal,
                      margin: new go.Margin(4, 0, 0, 0),
                      wrap: go.TextBlock.WrapFit,
                    }).bind("text", "", (n) =>
                      n.husbandRemainder
                        ? `($${withSuffix(n.wifeRemainder)} remaining)`
                        : ""
                    )
                  )
              )
          )
          .add(
            new go.Panel("Horizontal", {
              column: 1,
              maxSize: new go.Size(550, NaN),
              margin: new go.Margin(0, 0, 0, 8),
            })
              .add(
                new go.Picture("images/coins.svg", {
                  alignment: go.Spot.TopLeft,
                  desiredSize: new go.Size(48, 48),
                  opacity: 0.4,
                  margin: 8,
                })
              )
              .add(
                new go.Panel("Vertical", {
                  margin: 8,
                  alignment: go.Spot.TopCenter,
                })
                  .add(
                    new go.TextBlock("Husband's share", {
                      font: "20pt sans-serif",
                      alignment: go.Spot.Left,
                    }).bind(
                      "text",
                      "",
                      (data, node) =>
                        `${data.husband.key}'s share ($${withSuffix(
                          data.commonPropertyValue / 2 +
                            (data.husbandExtraValue ?? 0)
                        )})`
                    )
                  )
                  .add(
                    new go.TextBlock(
                      "Including individual assets and half of shared assets",
                      {
                        font: "12pt sans-serif",
                        alignment: go.Spot.Left,
                        stroke: "gray",
                        width: 300,
                        wrap: go.TextBlock.WrapFit,
                      }
                    )
                  )
                  .add(
                    new go.TextBlock("", {
                      font: "12pt sans-serif",
                      alignment: go.Spot.Center,
                      stroke: "black",
                      stretch: go.GraphObject.Horizontal,
                      margin: new go.Margin(4, 0, 0, 0),
                      wrap: go.TextBlock.WrapFit,
                    }).bind("text", "", (n) =>
                      n.husbandRemainder
                        ? `($${withSuffix(n.husbandRemainder)} remaining)`
                        : ""
                    )
                  )
              )
          )
      )
  )
  .add(
    new go.Panel("Spot", {
      stretch: go.GraphObject.Horizontal,
      margin: new go.Margin(-8, 0, 0, 0),
    })
      .add(
        new go.Shape("Rectangle", {
          opacity: 0,
          height: 0,
        })
      )
      .add(
        new go.Shape("Circle", {
          name: "wifeport",
          portId: "wifeport",
          fromLinkable: true,
          fromLinkableDuplicates: true,

          fill: "pink",
          stroke: "pink",
          strokeWidth: 2,
          desiredSize: new go.Size(20, 20),
          alignment: new go.Spot(0.25, 1),

          mouseEnter: (e, port: go.GraphObject) => {
            //@ts-ignore
            const shapePort: go.Shape = port;
            if (!e.diagram.isReadOnly) {
              shapePort.stroke = "black";
              shapePort.fromLinkable = false;
            }
          },
          mouseLeave: (e, port) => {
            //@ts-ignore
            const shapePort: go.Shape = port;
            shapePort.stroke = "pink";
            shapePort.fromLinkable = true;
          },
        })
      )
      .add(
        new go.Shape("Circle", {
          name: "husbandport",
          portId: "husbandport",
          fromLinkable: true,
          fromLinkableDuplicates: true,

          stroke: "#749ced",
          fill: "#749ced",
          strokeWidth: 2,
          desiredSize: new go.Size(20, 20),
          alignment: new go.Spot(0.75, 1),
          mouseEnter: (e, port: go.GraphObject) => {
            //@ts-ignore
            const shapePort: go.Shape = port;
            if (!e.diagram.isReadOnly) {
              shapePort.stroke = "black";
              shapePort.fromLinkable = false;
            }
          },
          mouseLeave: (e, port) => {
            //@ts-ignore
            const shapePort: go.Shape = port;
            shapePort.stroke = "#749ced";
            shapePort.fromLinkable = true;
          },
        })
      )
  );
