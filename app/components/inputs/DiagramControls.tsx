import { useEffect } from "react";
import { recomputeDiagram } from "../dataModels/Model";
import { NodeType } from "../dataModels/Node";
import { defaultModel } from "../planDiagramEntities/diagram";
import DiagramControlButton from "./DiagramControlButton";

export type Props = {
  diagram: go.Diagram;
};
export default function DiagramControls({ diagram }: Props) {
  useEffect(() => {
    async function importFlowbite() {
      // @ts-ignore
      await import("../../../node_modules/flowbite/dist/flowbite");
    }
    importFlowbite();
  });
  return (
    <div className="align-items-center flex max-h-72 flex-col  rounded-lg bg-slate-50 px-1 py-1">
      <DiagramControlButton
        id="trust"
        svgPath="/images/trust.svg"
        tooltipText="Add a trust"
        onClick={() => {
          if (diagram !== undefined) {
            diagram.model.commit(function (m: go.Model) {
              const nodeData = {
                key: "New Trust",
                name: "New Trust",
                category: NodeType.Trust,
              };
              m.addNodeData(nodeData);
              diagram.select(diagram.findNodeForData(nodeData));
            }, "Add a new trust");
          }
        }}
      />

      <DiagramControlButton
        id="person"
        svgPath="/images/person.svg"
        tooltipText="Add a beneficiary"
        onClick={() => {
          if (diagram !== undefined) {
            diagram.model.commit(function (m: go.Model) {
              const nodeData = {
                key: "New Beneficiary",
                category: "Beneficiary",
              };
              m.addNodeData(nodeData);
              diagram.select(diagram.findNodeForData(nodeData));
            }, "Add a new beneficiary");
          }
        }}
      />

      <DiagramControlButton
        id="stickynote"
        svgPath="/images/stickynote.svg"
        tooltipText="Stickynote"
        onClick={() => {
          alert("Stickynotes coming soon!");
        }}
      />

      <DiagramControlButton
        id="undo"
        svgPath="/images/undo.svg"
        tooltipText="Undo"
        onClick={() => {
          alert("No undo yet, sorry!");
        }}
      />

      <DiagramControlButton
        id="reset"
        svgPath="/images/reset.svg"
        tooltipText="Start over"
        onClick={() => {
          diagram.model = defaultModel();
          recomputeDiagram(diagram, undefined);
        }}
      />
    </div>
  );
}
