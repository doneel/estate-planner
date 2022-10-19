import * as go from "gojs";
import type { Transfer } from "../planSidebars/TransferSidebar";

export function updateTransferEntity(
  diagram: go.Diagram,
  transferEntity: go.Part,
  transferData: Partial<Transfer>
) {
  diagram?.startTransaction(`Update ${transferData}`);
  Object.entries(transferData).forEach(([key, value]) => {
    diagram.model.setDataProperty(transferEntity?.data, key, value);
  });
  diagram?.commitTransaction(`Update ${transferData}`);
}
export const TransferEntity = new go.Link({
  fromEndSegmentLength: 60,
  toEndSegmentLength: 60,
  curve: go.Link.Bezier,
  relinkableFrom: true,
  relinkableTo: true,
  selectionAdorned: true,
})
  .add(new go.Shape({ strokeWidth: 2 }))
  .add(new go.Shape({ toArrow: "Standard" }))
  .add(
    new go.Panel("Auto")
      .add(
        new go.Shape("RoundedRectangle", {
          stroke: "black",
          fill: "lightgray",
          opacity: 0.8,
        })
      )
      .add(
        new go.Panel("Vertical", { margin: 12 }).add(
          new go.TextBlock("").bind("text", "when"),
          new go.TextBlock("").bind("text", "valueType"),
          new go.TextBlock("").bind("text", "estimatedValue")
        )
      )
  );
