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
import type { JointEstate, Owner } from "../dataModels/Node";
import { isJointEstate } from "../dataModels/Node";
import { NodeType } from "../dataModels/Node";
import { isBeneficiary } from "../dataModels/Node";
import { isOwner } from "../dataModels/Node";
import { Node } from "../dataModels/Node";
import {
  defaultSerializer,
  deserializeLink,
  deserializeNode,
} from "../dataModels/Model";
import {
  JointEstateDiagram,
  updateJointEstateEntity,
} from "./JointEstateDiagram";
import { isTransfer } from "../dataModels/Link";

export type ModelType = Owner | Beneficiary | Transfer | JointEstate;

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
      const nodeEntity = deserializeNode(selected.data);
      if (nodeEntity === undefined) {
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
      if (isJointEstate(nodeEntity)) {
        setSidebar({
          entity: nodeEntity,
          updateCallback: (updateProps) => {
            const jointEstateEntity = e.diagram?.selection?.first();
            jointEstateEntity &&
              updateJointEstateEntity(
                e.diagram,
                jointEstateEntity,
                updateProps
              );
          },
        });
      }
    } else if (selected instanceof go.Link) {
      const linkEntity = deserializeLink(selected.data);
      if (linkEntity === undefined) {
        return;
      }
      if (isTransfer(linkEntity)) {
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
  diagram.nodeTemplateMap.add("JointEstate", JointEstateDiagram);
  diagram.linkTemplate = new go.Link({}).add(new go.Shape({ strokeWidth: 5 }));
  diagram.linkTemplateMap.add("transfer", TransferDiagram);

  const wife: Owner = {
    key: "Wife",
    category: NodeType.Owner,
    birthYear: undefined,
    expectedLifeSpan: undefined,
    annualGiftSummaries: [],
    giftMap: undefined,
  };

  const husband: Owner = {
    key: "Husband",
    category: NodeType.Owner,
    birthYear: undefined,
    expectedLifeSpan: undefined,
    annualGiftSummaries: [],
    giftMap: undefined,
  };

  const startData: Partial<JointEstate> = {
    key: "JointEstateKey",
    category: NodeType.JointEstate,
    wife,
    husband,
    commonPropertyValue: 12_361_000,
    husbandExtraValue: undefined,
    wifeExtraValue: undefined,
  };
  diagram.model = new go.GraphLinksModel({
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [wife, husband, startData],
    linkDataArray: [],
  });
  diagram.undoManager.isEnabled = true;
  return diagram;
}
