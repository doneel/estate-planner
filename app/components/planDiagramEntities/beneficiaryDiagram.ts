import * as go from "gojs";
import type { Beneficiary } from "../dataModels/Node";

export function updateBeneficiaryEntity(
  diagram: go.Diagram,
  beneficiaryEntity: go.Part,
  beneficiary: Partial<Beneficiary>
) {
  diagram?.startTransaction(`Update ${beneficiary.key}`);
  Object.entries(beneficiary).forEach(([key, value]) => {
    diagram.model.setDataProperty(beneficiaryEntity?.data, key, value);
  });
  diagram?.commitTransaction(`Update ${beneficiary.key}`);
}

export const BeneficiaryDiagram = new go.Node("Vertical", {
  selectable: true,
})
  .bind(
    new go.Binding("location", "location", go.Point.parse).makeTwoWay(
      go.Point.stringify
    )
  )
  .add(
    new go.Shape("Circle", {
      fill: "gray",
      stroke: "white",
      desiredSize: new go.Size(20, 20),
      toLinkable: true,
      portId: "",
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
        shapePort.fill = "gray";
        shapePort.toLinkable = true;
      },
    })
  )
  .add(
    new go.Picture("images/person.svg", {
      desiredSize: new go.Size(120, 120),
    })
  )
  .add(
    new go.TextBlock("default", {
      stroke: "gray",
      font: "bold 20pt sans-serif",
      editable: true,
    }).bind("text", "key")
  );
