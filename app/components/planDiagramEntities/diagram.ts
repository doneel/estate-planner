import {
  OwnerDiagram,
  updateOwnerEntity,
} from "~/components/planDiagramEntities/ownerDiagram";
import * as go from "gojs";
import {
  BeneficiaryDiagram,
  updateBeneficiaryEntity,
} from "./beneficiaryDiagram";
import type { Owner } from "../planSidebars/OwnerSidebar";
import type { Beneficiary } from "../planSidebars/BeneficiarySidebar";
import { TransferDiagram, updateTransferEntity } from "./transferDiagram";
import type { Transfer } from "../planSidebars/TransferSidebar";
import { defaultSerializer, Model } from "../dataModels/model";

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
    console.log(e.diagram.model.toJson());
    const dataModel = defaultSerializer.deserialize(
      //e.diagram.model.modelData,
      e.diagram.model.toJson(),
      Model
    );
    console.log(dataModel);
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
      },
      {
        from: "Tom",
        to: "Tom Jr.",
        category: "transfer",
        date: new Date("01/01/2030"),
        fixedValue: 200000,
      },
      {
        from: "Mary",
        to: "Tom Jr.",
        category: "transfer",
        date: new Date(2024, 1, 17),
        fixedValue: 7,
      },
    ],
  });
  diagram.undoManager.isEnabled = true;
  return diagram;
}
