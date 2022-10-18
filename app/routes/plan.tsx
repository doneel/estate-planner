import React from "react";
import OwnerForm from "~/components/planForms/OwnerForm";

export default function PlanPage() {
  const [diagram, setDiagram] = React.useState<go.Diagram | undefined>(
    undefined
  );

  React.useEffect(() => {
    async function initialize() {
      const diagramEntity = await import(
        "~/components/planDiagramEntities/diagram"
      );
      if (diagram === undefined) {
        setDiagram(
          await diagramEntity.initDiagram({
            setSidebar: ({ entity, updateCallback }) => {
              setSelectedItemForm(
                <OwnerForm owner={entity} setOwner={updateCallback} />
              );
            },
          })
        );
      }
    }
    initialize();
  });

  const [selectedItemForm, setSelectedItemForm] = React.useState(<>ok</>);

  function addOwner() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        m.addNodeData({ key: "New Owner", category: "Owner" });
      }, "Add a new owner");
    }
  }

  return (
    <main className="flex h-full flex-col">
      <h1 className="mx-auto text-4xl">New estate plan</h1>
      <button onClick={addOwner}>Add owner</button>
      <div className="flex h-full w-full">
        <div className="h-full w-1/3 px-8">{selectedItemForm}</div>
        <div
          id="myDiagramDiv"
          className=" h-full w-full border border-gray-700"
        ></div>
      </div>
    </main>
  );
}
