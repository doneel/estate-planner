import React from "react";
import { e } from "vitest/dist/index-6e18a03a";
import { updateOwnerEntity } from "~/components/planDiagramEntities/owner";
import type { Owner } from "../planForms/OwnerForm";

export type SetSidebarProps = {
  entity: Owner;
  updateCallback: (entity: Partial<Owner>) => void;
};
export type Props = {
  setSidebar: (props: SetSidebarProps) => void;
};

export function addOwner() {}

export async function initDiagram({ setSidebar }: Props) {
  function onSelectChange(e: go.DiagramEvent) {
    const node = e.diagram.selection.first();
    if (node instanceof go.Node) {
      if (node.data.category === "Owner") {
        setSidebar({
          entity: {
            name: node.data?.key,
            birthYear: node.data?.birthYear,
            netWorth: node.data?.netWorth,
            expectedLifeSpan: node.data?.expectedLifeSpan,
          },
          updateCallback: (owner: Partial<Owner>) => {
            const ownerEntity = e.diagram?.selection?.first();
            ownerEntity && updateOwnerEntity(e.diagram, ownerEntity, owner);
          },
        });
      }
    }
  }

  console.log("running");
  const go = await import("gojs");
  const OwnerEntity = await import("~/components/planDiagramEntities/owner");
  const diagram = new go.Diagram("myDiagramDiv", {
    layout: new go.LayeredDigraphLayout({
      direction: 90,
      layerSpacing: 150,
      columnSpacing: 100,
      initializeOption: go.LayeredDigraphLayout.InitNaive,
    }),
    //model: new go.GraphLinksModel({ linkKeyProperty: "key" }),
  });

  diagram.addDiagramListener("ChangedSelection", onSelectChange);
  diagram.nodeTemplateMap.add("Owner", OwnerEntity.OwnerEntity);
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
