import * as go from "gojs";
import type { Beneficiary } from "../planSidebars/BeneficiarySidebar";

export function updateBeneficiaryEntity(
  diagram: go.Diagram,
  beneficiaryEntity: go.Part,
  beneficiary: Partial<Beneficiary>
) {
  diagram?.startTransaction(`Update ${beneficiary.name}`);
  Object.entries(beneficiary).forEach(([key, value]) => {
    diagram.model.setDataProperty(beneficiaryEntity?.data, key, value);
  });
  diagram.model.setDataProperty(
    beneficiaryEntity?.data,
    "key",
    beneficiary.name
  );
  diagram?.commitTransaction(`Update ${beneficiary.name}`);
}

export const BeneficiaryEntity = new go.Node("Vertical", {
  selectable: true,
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
  )
  .add(new go.Shape("Ellipse", { width: 120, height: 180, fill: "gray" }))
  .add(
    new go.TextBlock("default", {
      stroke: "red",
      font: "bold 24pt sans-serif",
      editable: true,
    }).bind("text", "key")
  );
