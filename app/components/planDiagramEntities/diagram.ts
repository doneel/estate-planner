import {
  OwnerEntity,
  updateOwnerEntity,
} from "~/components/planDiagramEntities/owner";
import * as go from "gojs";
import { BeneficiaryEntity, updateBeneficiaryEntity } from "./beneficiary";
import type { Owner } from "../planSidebars/OwnerSidebar";
import type { Beneficiary } from "../planSidebars/BeneficiarySidebar";
export type ModelType = Owner | Beneficiary;

export type SetSidebarProps<T extends ModelType> = {
  entity: T;
  updateCallback: <T>(entity: Partial<T>) => void;
};
export type Props = {
  setSidebar: (props: SetSidebarProps<ModelType>) => void;
};

export function addOwner() {}

export async function initDiagram({ setSidebar }: Props) {
  function onSelectChange(e: go.DiagramEvent) {
    const node = e.diagram.selection.first();
    if (node instanceof go.Node) {
      const data: Owner | Beneficiary = node.data;
      switch (data.category) {
        case "Owner":
          const props: SetSidebarProps<Owner> = {
            entity: {
              name: node.data?.key,
              category: node.data?.category,
              birthYear: node.data?.birthYear,
              netWorth: node.data?.netWorth,
              expectedLifeSpan: node.data?.expectedLifeSpan,
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
              name: node.data?.key,
              category: node.data?.category,
              birthYear: node.data?.birthYear,
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
    }
  }

  console.log("running");
  const diagram = new go.Diagram("myDiagramDiv", {
    layout: new go.LayeredDigraphLayout({
      direction: 90,
      layerSpacing: 150,
      columnSpacing: 100,
      initializeOption: go.LayeredDigraphLayout.InitNaive,
    }),
  });

  diagram.addDiagramListener("ChangedSelection", onSelectChange);
  diagram.nodeTemplateMap.add("Owner", OwnerEntity);
  diagram.nodeTemplateMap.add("Beneficiary", BeneficiaryEntity);
  diagram.linkTemplate = new go.Link({}).add(new go.Shape({ strokeWidth: 5 }));
  diagram.linkTemplateMap.add(
    "gift",
    new go.Link({
      fromEndSegmentLength: 100,
      toEndSegmentLength: 100,
      routing: go.Link.Orthogonal,
      corner: 12,
      relinkableFrom: true,
      relinkableTo: true,
      selectionAdorned: false,
    })
      .add(new go.Shape({ strokeWidth: 2 }))
      .add(new go.Shape({ toArrow: "Standard" }))
      .add(
        new go.Panel("Auto")
          .add(
            new go.Shape("RoundedRectangle", {
              stroke: "black",
              fill: "lightgray",
            })
          )
          .add(
            new go.Panel("Vertical", { margin: 12 }).add(
              new go.TextBlock("").bind("text", "when"),
              new go.TextBlock("").bind("text", "valueType"),
              new go.TextBlock("").bind("text", "estimatedValue")
            )
          )
      )
  );
  diagram.model = new go.GraphLinksModel({
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [
      { key: "Mary", category: "Owner", netWorth: null },
      { key: "Tom", category: "Owner", netWorth: null },
      { key: "Tom Jr.", category: "Owner", netWorth: null },
    ],
    linkDataArray: [
      {
        from: "Tom",
        fromPort: "OUT",
        toPort: "IN",
        to: "Tom Jr.",
        category: "gift",
        when: "On death",
        valueType: "All remaining assets",
        estimatedValue: "49,000",
      },
      {
        from: "Mary",
        fromPort: "OUT",
        toPort: "IN",
        to: "Tom Jr.",
        category: "gift",
        when: new Date(2024, 1, 17),
        valueType: "Fixed",
        estimatedValue: "19,000",
      },
    ],
  });
  diagram.undoManager.isEnabled = true;
  return diagram;
}
