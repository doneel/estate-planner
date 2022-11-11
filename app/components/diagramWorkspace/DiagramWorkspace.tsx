import type { Diagram } from "gojs";
import React from "react";
import BeneficiarySidebar from "../planSidebars/BeneficiarySidebar";
import JointEstateSidebar from "../planSidebars/JointEstateSidebar";
import OnDeathSidebar from "../planSidebars/OnDeathSidebar";
import OwnerSidebar from "../planSidebars/OwnerSidebar";
import TransferSidebar from "../planSidebars/TransferSidebar";
import TrustSidebar from "../planSidebars/TrustSidebar";

export type Props = {
  diagramDivId: string;
  diagram: Diagram | undefined;
  setDiagram: React.Dispatch<React.SetStateAction<Diagram | undefined>>;
  initialPlan: string | undefined;
  savePlan: React.Dispatch<React.SetStateAction<string | undefined>>;
  sidebarContent: JSX.Element;
  setSidebarContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
};

export default function DiagramWorkspace({
  diagram,
  setDiagram,
  diagramDivId,
  initialPlan,
  savePlan,
  sidebarContent,
  setSidebarContent,
}: Props) {
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
                  setSidebarContent(
                    <OwnerSidebar owner={entity} setOwner={updateCallback} />
                  );
                  return;
                case "Beneficiary":
                  setSidebarContent(
                    <BeneficiarySidebar
                      beneficiary={entity}
                      setBeneficiary={updateCallback}
                    />
                  );
                  return;
                case "JointEstate":
                  setSidebarContent(
                    <JointEstateSidebar
                      jointEstate={entity}
                      setJointEstate={updateCallback}
                    />
                  );
                  return;
                case "Trust":
                  setSidebarContent(
                    <TrustSidebar trust={entity} setTrust={updateCallback} />
                  );
                  return;
                case "transfer":
                  setSidebarContent(
                    <TransferSidebar
                      transfer={entity}
                      setTransfer={updateCallback}
                    />
                  );
                  return;
                case "onDeath":
                  setSidebarContent(
                    <OnDeathSidebar
                      onDeath={entity}
                      setOnDeath={updateCallback}
                    />
                  );
                  return;
              }
            },
            modelJson: initialPlan,
            saveModel: savePlan,
          })
        );
      }
    }
    initialize();
  });

  return (
    <div className="flex h-screen w-full">
      <div className="h-full min-h-screen w-320 resize-x overflow-auto px-8 pt-8">
        {sidebarContent}
      </div>
      <div
        id={diagramDivId}
        className="min-h-full grow border-l border-gray-300"
      ></div>
    </div>
  );
}
