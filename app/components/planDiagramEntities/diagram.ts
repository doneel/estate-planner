import {
  OwnerDiagram,
  updateOwnerEntity,
} from "~/components/planDiagramEntities/ownerDiagram";
import * as go from "gojs";
import {
  BeneficiaryDiagram,
  updateBeneficiaryEntity,
} from "./beneficiaryDiagram";
import { TransferDiagram, updateTransferEntity } from "./transferDiagram";
import type { Beneficiary, JointEstate, Trust } from "../dataModels/Node";
import { isTrust } from "../dataModels/Node";
import { FirstDeath, Owner } from "../dataModels/Node";
import { isJointEstate } from "../dataModels/Node";
import { NodeType } from "../dataModels/Node";
import { isBeneficiary } from "../dataModels/Node";
import { isOwner } from "../dataModels/Node";
import {
  deserializeLink,
  deserializeNode,
  recomputeDiagram,
} from "../dataModels/Model";
import {
  JointEstateDiagram,
  updateJointEstateEntity,
} from "./JointEstateDiagram";
import type { OnDeath, Transfer } from "../dataModels/Link";
import { isOnDeath, isTransfer } from "../dataModels/Link";
import { OnDeathDiagram, updateOnDeathEntity } from "./OnDeathDiagram";
import BandedLayerLayout from "./layout/BandedLayerLayout";
import { BandsDiagram } from "./layout/BandsDiagram";
import type React from "react";
import { TrustDiagram, updateTrustEntity } from "./TrustDiagram";
import { StickynoteDiagram } from "./Stickynote";

export type ModelType =
  | Owner
  | Beneficiary
  | Transfer
  | JointEstate
  | OnDeath
  | Trust;

export type SetSidebarProps<T extends ModelType> = {
  entity: T;
  updateCallback: <T>(entity: Partial<T>) => void;
};
export type Props = {
  setSidebar: (props: SetSidebarProps<ModelType>) => void;
  modelJson?: string;
  saveModel: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function defaultModel() {
  const wife = new Owner("Wife");
  const husband = new Owner("Husband");

  const startData: Partial<JointEstate> = {
    key: "JointEstate",
    category: NodeType.JointEstate,
    wife,
    husband,
    commonPropertyValue: 12_361_000,
    husbandExtraValue: undefined,
    wifeExtraValue: undefined,
    firstDeath: FirstDeath.Husband,
  };

  const bands = {
    // this is the information needed for the headers of the bands
    key: "_BANDS",
    category: "Bands",
    itemArray: [
      { text: "" },
      { text: "After wife passes" },
      { text: "After husband passes" },
    ],
  };
  return new go.GraphLinksModel({
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [wife, husband, startData, bands],
    linkDataArray: [],
  });
}

export async function initDiagram({ setSidebar, modelJson, saveModel }: Props) {
  function onSelectChange(e: go.DiagramEvent) {
    const selected = e.diagram.selection.first();
    if (selected instanceof go.Node) {
      const nodeEntity = deserializeNode(selected.data);
      console.log(nodeEntity);
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
          entity: nodeEntity,
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
      if (isTrust(nodeEntity)) {
        setSidebar({
          entity: nodeEntity,
          updateCallback: (updateProps) => {
            const trustEntity = e.diagram?.selection?.first();
            trustEntity &&
              updateTrustEntity(e.diagram, trustEntity, updateProps);
          },
        });
      }
    } else if (selected instanceof go.Link) {
      const linkEntity = deserializeLink(selected.data);
      console.log(linkEntity);
      if (linkEntity === undefined) {
        return;
      }
      if (isTransfer(linkEntity)) {
        setSidebar({
          entity: linkEntity,
          updateCallback: (transfer) => {
            const transferEntity = e.diagram?.selection?.first();
            transferEntity &&
              updateTransferEntity(e.diagram, transferEntity, transfer);
          },
        });
      } else if (isOnDeath(linkEntity)) {
        setSidebar({
          entity: linkEntity,
          updateCallback: (updateProps) => {
            const linkEntity = e.diagram?.selection.first();
            linkEntity &&
              updateOnDeathEntity(e.diagram, linkEntity, updateProps);
          },
        });
      }
    }
  }

  function onNodeChange(e: go.ChangedEvent) {
    if (
      e.change === go.ChangedEvent.Transaction &&
      e?.object?.name !== "Move" &&
      e?.object?.name !== "Initial Layout" &&
      e.isTransactionFinished
    ) {
      if (
        ["transfer", "onDeath"].includes(
          diagram.selection.first()?.data.category
        )
      ) {
        const linkKey = diagram.selection.first()?.data.key;
        recomputeDiagram(diagram, saveModel);
        const foundLink = diagram.findLinksByExample({ key: linkKey }).first();
        diagram.select(
          foundLink ? foundLink : diagram.findPartForKey("JointEstate")
        );
      } else {
        const selectedKey = diagram.selection.first()?.key;
        recomputeDiagram(diagram, saveModel);
        const reselectable = diagram.findPartForKey(selectedKey);
        diagram.select(
          reselectable ? reselectable : diagram.findPartForKey("JointEstate")
        );
      }
    }
  }

  const diagram = new go.Diagram("myDiagramDiv", {
    layout: new BandedLayerLayout({
      direction: 90,
      layerSpacing: 150,
      columnSpacing: 100,
      setsPortSpots: false,
      packOption: go.LayeredDigraphLayout.PackExpand,
    }),
  });
  diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

  diagram.addDiagramListener("ChangedSelection", onSelectChange);
  diagram.addModelChangedListener(onNodeChange);
  diagram.nodeTemplateMap.add(NodeType.Owner, OwnerDiagram);
  diagram.nodeTemplateMap.add(NodeType.Beneficiary, BeneficiaryDiagram);
  diagram.nodeTemplateMap.add(NodeType.JointEstate, JointEstateDiagram);
  diagram.nodeTemplateMap.add(NodeType.Bands, BandsDiagram);
  diagram.nodeTemplateMap.add(NodeType.Trust, TrustDiagram);
  diagram.nodeTemplateMap.add(NodeType.Stickynote, StickynoteDiagram);
  diagram.linkTemplate = new go.Link({}).add(new go.Shape({ strokeWidth: 5 }));
  diagram.linkTemplateMap.add("transfer", TransferDiagram);
  diagram.linkTemplateMap.add("onDeath", OnDeathDiagram);

  if (modelJson) {
    diagram.model = go.Model.fromJson(modelJson);
  } else {
    diagram.model = defaultModel();
  }
  diagram.undoManager.isEnabled = true;
  recomputeDiagram(diagram, saveModel);
  diagram.select(diagram.findPartForKey("JointEstate"));
  return diagram;
}
