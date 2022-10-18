import React from "react";
import BeneficiarySidebar from "~/components/planSidebars/BeneficiarySidebar";
import OwnerSidebar from "~/components/planSidebars/OwnerSidebar";

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
              switch (entity.category) {
                case "Owner":
                  setSelectedItemForm(
                    <OwnerSidebar owner={entity} setOwner={updateCallback} />
                  );
                  return;
                case "Beneficiary":
                  setSelectedItemForm(
                    <BeneficiarySidebar
                      beneficiary={entity}
                      setBeneficiary={updateCallback}
                    />
                  );
                  return;
              }
            },
          })
        );
      }
    }
    initialize();
  });

  const [selectedItemForm, setSelectedItemForm] = React.useState(<></>);

  function addOwner() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        m.addNodeData({ key: "New Owner", category: "Owner" });
      }, "Add a new owner");
    }
  }

  function addBeneficiary() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        const nodeData = { key: "New Beneficiary", category: "Beneficiary" };
        m.addNodeData(nodeData);
        diagram.select(diagram.findNodeForData(nodeData));
      }, "Add a new beneficiary");
    }
  }

  return (
    <main className="flex h-full flex-col">
      <h1 className="mx-auto text-4xl">New estate plan</h1>
      <div className="mx-auto my-4 space-x-8">
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addOwner}
        >
          Add owner
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addBeneficiary}
        >
          Add beneficiary
        </button>
      </div>
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
