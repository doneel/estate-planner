import go, { Binding, Margin } from "gojs";
import type { Trust } from "../dataModels/Node";

export function updateTrustEntity(
  diagram: go.Diagram,
  trustEntity: go.Part,
  updateParams: Trust
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

export const TrustDiagram = new go.Node("Auto", {})
  .add(
    new go.Shape("RoundedRectangle", {
      strokeWidth: 1,
      fill: "#f2f2f9",
    })
  )
  .add(
    new go.Panel("Vertical", { margin: 8 })
      .add(
        new go.Panel("Auto", {
          stretch: go.GraphObject.Horizontal,
          margin: 12,
        })
          .add(new go.Shape("Rectangle", { opacity: 0 }))
          .add(
            new go.Picture("images/trust.svg", {
              alignment: go.Spot.TopLeft,
              opacity: 0.4,
              desiredSize: new go.Size(40, 40),
            })
          )
          .add(
            new go.TextBlock("", {
              margin: new Margin(4, 0, 0, 0),
              alignment: go.Spot.TopCenter,
              font: "20pt bold sans-serif",
            }).bind("text", "name")
          )
      )
      .add(
        new go.Panel("Vertical", {
          margin: new Margin(0, 0, 0, 16),
          alignment: go.Spot.Left,
        })
          .add(
            new go.TextBlock("", {
              alignment: go.Spot.Left,
              font: "12pt sans-serif",
            }).bind("text", "trustees", (t) => `Trustees: ${t}`)
          )
          .add(
            new go.TextBlock("", {
              alignment: go.Spot.Left,
              font: "12pt sans-serif",
              isMultiline: true,
              textAlign: "left",
              editable: true,
            }).bind(new Binding("text", "notes").makeTwoWay())
          )
      )
  );
