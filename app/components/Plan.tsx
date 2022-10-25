import React from "react";
import { defaultSerializer, Model } from "~/components/dataModels/Model";
import type { JointEstate } from "~/components/dataModels/Node";
import { Owner } from "~/components/dataModels/Node";
import { NodeType } from "~/components/dataModels/Node";
import { defaultModel } from "~/components/planDiagramEntities/diagram";
import BeneficiarySidebar from "~/components/planSidebars/BeneficiarySidebar";
import JointEstateSidebar from "~/components/planSidebars/JointEstateSidebar";
import OnDeathSidebar from "~/components/planSidebars/OnDeathSidebar";
import OwnerSidebar from "~/components/planSidebars/OwnerSidebar";
import TransferSidebar from "~/components/planSidebars/TransferSidebar";
import useLocalStorageState from "~/hooks/useLocalStorageState";

export default function Plan() {
  const [diagram, setDiagram] = React.useState<go.Diagram | undefined>(
    undefined
  );
  const [savedPlan, setSavedPlan] = useLocalStorageState<string | undefined>(
    "plan",
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
                case "JointEstate":
                  setSelectedItemForm(
                    <JointEstateSidebar
                      jointEstate={entity}
                      setJointEstate={updateCallback}
                    />
                  );
                  return;
                case "transfer":
                  setSelectedItemForm(
                    <TransferSidebar
                      transfer={entity}
                      setTransfer={updateCallback}
                    />
                  );
                  return;
                case "onDeath":
                  setSelectedItemForm(
                    <OnDeathSidebar
                      onDeath={entity}
                      setOnDeath={updateCallback}
                    />
                  );
                  return;
              }
            },
            modelJson: savedPlan,
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

  function addJointEstate() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        const wife = new Owner("Wife");
        const husband = new Owner("Husband");

        const startData: Partial<JointEstate> = {
          key: "JointEstateKey",
          category: NodeType.JointEstate,
          wife,
          husband,
          commonPropertyValue: undefined,
          husbandExtraValue: undefined,
          wifeExtraValue: undefined,
        };

        m.addNodeDataCollection([wife, husband, startData]);
      }, "Create a new joint estate");
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

  function resetLayout() {
    if (diagram !== undefined) {
      diagram.layout.invalidateLayout();
      diagram.model.commit(function (m: go.Model) {
        diagram.nodes.each((n) => n.moveTo(n.location.x + 1, n.location.y));
      }, "Move nodes around");
    }
  }

  function newDiagram() {
    if (diagram !== undefined) {
      setSavedPlan(undefined);
      diagram.model = defaultModel();
    }
  }

  async function recalculate() {
    const go = await import("gojs");
    if (diagram !== undefined) {
      setSelectedItemForm(<></>);
      const selectedKey = diagram.selection.first()?.key;
      //console.log("BEFORE DESERIALIZING", diagram.model.toJson());
      const dataModel = defaultSerializer.deserialize(
        diagram.model.toJson(),
        Model
      );
      //console.log("DESIERIALIZED", dataModel);
      if (
        dataModel !== undefined &&
        dataModel !== null &&
        !(dataModel instanceof Array)
      ) {
        dataModel.calculateAll();
        diagram.model = go.Model.fromJson(
          JSON.stringify(defaultSerializer.serialize(dataModel))
        );
        setSavedPlan(JSON.stringify(defaultSerializer.serialize(dataModel)));
        console.log(dataModel);

        diagram.select(diagram.findPartForKey(selectedKey));
      }
    }
  }

  return (
    <main className="flex h-full flex-col">
      <h1 className="mx-auto text-4xl">New estate plan</h1>
      <div className="mx-auto my-4 space-x-8">
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addJointEstate}
        >
          Add Joint Estate
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={addBeneficiary}
        >
          Add beneficiary
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={recalculate}
        >
          Recalculate
        </button>
        <button
          className="w-48 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          onClick={newDiagram}
        >
          Start over
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