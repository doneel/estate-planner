import type { Diagram } from "gojs";
import React from "react";
import DiagramControls from "../inputs/DiagramControls";
import BeneficiarySidebar from "../planSidebars/BeneficiarySidebar";
import JointEstateSidebar from "../planSidebars/JointEstateSidebar";
import OnDeathSidebar from "../planSidebars/OnDeathSidebar";
import OwnerSidebar from "../planSidebars/OwnerSidebar";
import TransferSidebar from "../planSidebars/TransferSidebar";
import TrustSidebar from "../planSidebars/TrustSidebar";
import { initDiagram } from "~/components/planDiagramEntities/diagram";
import { getStylesheetPrefetchLinks } from "@remix-run/react/dist/links";
import { waitForDebugger } from "inspector";

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
      if (diagram === undefined) {
        setDiagram(
          await initDiagram({
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
    <div className="flex w-full flex-col lg:flex-row">
      <div
        id="mobile-warning"
        className="max-w-s flex w-full items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400 lg:hidden"
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Warning icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">
          Our plan editor isn't mobile-friendly yet. We recommend using a
          computer.
        </div>
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          data-dismiss-target="#mobile-warning"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <div className="h-[75vh] grow border-b border-gray-300 lg:order-2 lg:h-screen lg:border-l">
        <div className="absolute z-10 mt-16 ml-16">
          {diagram ? <DiagramControls diagram={diagram} /> : <></>}
        </div>
        <div id={diagramDivId} className="h-full lg:min-h-screen"></div>
      </div>
      <div className="h-full resize-x overflow-auto px-8 py-8 lg:order-1 lg:w-320">
        {sidebarContent}
      </div>
    </div>
  );
}
