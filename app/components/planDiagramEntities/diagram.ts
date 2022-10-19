import {
  OwnerEntity,
  updateOwnerEntity,
} from "~/components/planDiagramEntities/owner";
import * as go from "gojs";
import { BeneficiaryEntity, updateBeneficiaryEntity } from "./beneficiary";
import type { Owner } from "../planSidebars/OwnerSidebar";
import type { Beneficiary } from "../planSidebars/BeneficiarySidebar";
import { TransferEntity, updateTransferEntity } from "./transfer";
import type { Transfer } from "../planSidebars/TransferSidebar";

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
      const data: Owner | Beneficiary = selected.data;
      switch (data.category) {
        case "Owner":
          const props: SetSidebarProps<Owner> = {
            entity: {
              name: selected.data?.key,
              category: selected.data?.category,
              birthYear: selected.data?.birthYear,
              netWorth: selected.data?.netWorth,
              expectedLifeSpan: selected.data?.expectedLifeSpan,
            },
            updateCallback: (owner: Partial<Owner>) => {
              const ownerEntity = e.diagram?.selection?.first();
              ownerEntity && updateOwnerEntity(e.diagram, ownerEntity, owner);
            },
          };
          setSidebar(props);
          return;

        case "Beneficiary":
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
          return;
      }
    } else if (selected instanceof go.Link) {
      switch (selected.data.category) {
        case "transfer":
          console.log(selected.data);
          setSidebar({
            entity: {
              category: selected.data?.category,
              date: selected.data?.date,
              isGift: selected.data?.isGift,
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
  diagram.nodeTemplateMap.add("Owner", OwnerEntity);
  diagram.nodeTemplateMap.add("Beneficiary", BeneficiaryEntity);
  diagram.linkTemplate = new go.Link({}).add(new go.Shape({ strokeWidth: 5 }));
  diagram.linkTemplateMap.add("transfer", TransferEntity);
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
        when: "On death",
        valueType: "All remaining assets",
        estimatedValue: "49,000",
      },
      {
        from: "Tom",
        to: "Tom Jr.",
        category: "transfer",
        when: "On death",
        valueType: "SOME remaining assets",
        estimatedValue: "49,000",
      },
      {
        from: "Mary",
        to: "Tom Jr.",
        category: "transfer",
        when: new Date(2024, 1, 17).toLocaleDateString(),
        valueType: "Fixed",
        estimatedValue: "19,000",
      },
    ],
  });
  diagram.undoManager.isEnabled = true;
  return diagram;
}
