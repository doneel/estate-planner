import React from "react";
import { recomputeDiagram } from "~/components/dataModels/Model";
import { defaultModel } from "~/components/planDiagramEntities/diagram";
import { NodeType } from "../dataModels/Node";
import LocallySavedWorkspace from "./LocallySavedWorkspace";

export default function Plan() {
  const [diagram, setDiagram] = React.useState<go.Diagram | undefined>(
    undefined
  );
  const [selectedItemForm, setSelectedItemForm] = React.useState(<></>);

  function addBeneficiary() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        const nodeData = { key: "New Beneficiary", category: "Beneficiary" };
        m.addNodeData(nodeData);
        diagram.select(diagram.findNodeForData(nodeData));
      }, "Add a new beneficiary");
    }
  }

  function addTrust() {
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
  }

  function resetLayout() {
    if (diagram !== undefined) {
      diagram.layout.invalidateLayout();
      diagram.model.commit(function (m: go.Model) {
        diagram.nodes.each((n) => n.moveTo(n.location.x + 1, n.location.y));
      }, "Move nodes around");
    }
  }

  async function newDiagram() {
    if (diagram !== undefined) {
      diagram.model = defaultModel();
      recomputeDiagram(diagram, setSavedPlan);
      setSelectedItemForm(<></>);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="mx-auto text-4xl">New estate plan</h1>
      <div className="mx-auto my-4 space-x-8">
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addBeneficiary}
        >
          Add beneficiary
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addTrust}
        >
          Add trust
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={newDiagram}
        >
          Start over
        </button>
      </div>
      <LocallySavedWorkspace
        diagramDivId="myDiagramDiv"
        diagram={diagram}
        setDiagram={setDiagram}
        sidebarContent={selectedItemForm}
        setSidebarContent={setSelectedItemForm}
      />
    </div>
  );
}
