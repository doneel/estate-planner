import {
  OwnerDiagram,
  updateOwnerEntity,
} from "~/components/planDiagramEntities/ownerDiagram";
import * as go from "gojs";
import {
  BeneficiaryDiagram,
  updateBeneficiaryEntity,
} from "./beneficiaryDiagram";
import type { Beneficiary } from "../planSidebars/BeneficiarySidebar";
import { TransferDiagram, updateTransferEntity } from "./transferDiagram";
import type { Transfer } from "../planSidebars/TransferSidebar";
import type { Owner } from "../dataModels/Node";
import { isBeneficiary } from "../dataModels/Node";
import { isOwner } from "../dataModels/Node";
import { Node } from "../dataModels/Node";
import { defaultSerializer } from "../dataModels/Model";

export type ModelType = Owner | Beneficiary | Transfer;

export type SetSidebarProps<T extends ModelType> = {
  entity: T;
  updateCallback: <T>(entity: Partial<T>) => void;
};
export type Props = {
  setSidebar: (props: SetSidebarProps<ModelType>) => void;
};

class FixedLayout extends go.LayeredDigraphLayout {
  doLayout(coll: go.Diagram | go.Group | go.Iterable<go.Part>) {
    super.doLayout(coll);
    if (coll instanceof go.Diagram) {
      const diagram: go.Diagram = coll;
      diagram.model.commit(function (m: go.Model) {
        diagram.nodes.each((n) => n.moveTo(n.location.x + 1, n.location.y));
      }, "");
    }
  }
}

export async function initDiagram({ setSidebar }: Props) {
  function onSelectChange(e: go.DiagramEvent) {
    const selected = e.diagram.selection.first();
    if (selected instanceof go.Node) {
      const nodeEntity = defaultSerializer.deserialize(selected.data, Node);
      if (
        nodeEntity === undefined ||
        nodeEntity === null ||
        nodeEntity instanceof Array
      ) {
        console.error("Couldn't deserialize selected node data", selected.data);
        return;
      }
      if (isOwner(nodeEntity)) {
        const props: SetSidebarProps<Owner> = {
          entity: nodeEntity,
          updateCallback: (owner: Partial<Owner>) => {
            const ownerEntity = e.diagram?.selection?.first();
            ownerEntity && updateOwnerEntity(e.diagram, ownerEntity, owner);
          },
        };
        setSidebar(props);
      }
      if (isBeneficiary(nodeEntity)) {
        setSidebar({
          entity: {
            name: selected.data?.key,
            category: selected.data?.category,
            birthYear: selected.data?.birthYear,
          },
          updateCallback: (beneficiary) => {
            const beneficiaryEntity = e.diagram?.selection?.first();
            beneficiaryEntity &&
              updateBeneficiaryEntity(
                e.diagram,
                beneficiaryEntity,
                beneficiary
              );
          },
        });
      }
    } else if (selected instanceof go.Link) {
      switch (selected.data.category) {
        case "transfer":
          setSidebar({
            entity: {
              category: selected.data?.category,
              date: selected.data?.date,
              isGift: selected.data?.isGift,
              fixedValue: selected.data?.fixedValue,
            },
            updateCallback: (transfer) => {
              const transferEntity = e.diagram?.selection?.first();
              transferEntity &&
                updateTransferEntity(e.diagram, transferEntity, transfer);
            },
          });
          return;
      }
    }
  }

  const diagram = new go.Diagram("myDiagramDiv", {
    layout: new FixedLayout({
      direction: 90,
      layerSpacing: 150,
      columnSpacing: 200,
      setsPortSpots: false,
    }),
  });
  diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

  diagram.addDiagramListener("ChangedSelection", onSelectChange);
  diagram.nodeTemplateMap.add("Owner", OwnerDiagram);
  diagram.nodeTemplateMap.add("Beneficiary", BeneficiaryDiagram);
  diagram.linkTemplate = new go.Link({}).add(new go.Shape({ strokeWidth: 5 }));
  diagram.linkTemplateMap.add("transfer", TransferDiagram);
  diagram.model = new go.GraphLinksModel({
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [
      { key: "Mary", category: "Owner", netWorth: null },
      { key: "Tom", category: "Owner", netWorth: null },
      { key: "Tom Jr.", category: "Beneficiary", birthYear: 1992 },
    ],
    linkDataArray: [
      {
        from: "Tom",
        to: "Tom Jr.",
        category: "transfer",
        date: new Date("01/01/2023"),
        fixedValue: 1000000,
        isGift: true,
      },
      {
        from: "Tom",
        to: "Tom Jr.",
        category: "transfer",
        date: new Date("01/01/2030"),
        fixedValue: 200000,
        isGift: true,
      },
      {
        from: "Mary",
        to: "Tom Jr.",
        category: "transfer",
        date: new Date(2024, 1, 17),
        fixedValue: 7,
        isGift: true,
      },
    ],
  });
  diagram.undoManager.isEnabled = true;
  return diagram;
}
