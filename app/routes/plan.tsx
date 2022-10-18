import React from "react";
import type {
  Person,
  Props as PersonProps,
} from "~/components/planForms/PersonForm";
import PersonForm from "~/components/planForms/PersonForm";

export default function PlanPage() {
  const [diagram, setDiagram] = React.useState<go.Diagram | undefined>(
    undefined
  );

  const [selectedPerson, setSelectedPerson] = React.useState<
    Person | undefined
  >(undefined);
  React.useEffect(() => {
    if (diagram === undefined) {
      initDiagram();
    }
  });

  const [selectedItemForm, setSelectedItemForm] = React.useState(<>ok</>);

  function addPerson() {
    if (diagram !== undefined) {
      diagram.model.commit(function (m: go.Model) {
        m.addNodeData({ key: "New Person", category: "Person" });
      }, "Add a new person");
    }
  }

  function addGift(e: go.InputEvent, button: go.GraphObject) {
    var node: go.Part = button.part.adornedPart;
    e.diagram.clearSelection();

    var tool = e.diagram.toolManager.linkingTool;
    tool.archetypeLinkData = {
      fromPort: "OUT",
      toPort: "IN",
      category: "gift",
      when: "On death",
      valueType: "All remaining assets",
      estimatedValue: "49,000",
    };
    tool.startObject = node.findObject("outport");
    node.diagram.currentTool = tool;
    tool.doActivate();
  }

  function onSelectChange(e: go.DiagramEvent) {
    const node = e.diagram.selection.first();
    if (node instanceof go.Node) {
      if (node.data.category === "Person") {
        setSelectedPerson({ ...node.data, name: node.data.key });
        console.log("Should trigger re-render", node.data);

        setSelectedItemForm(
          <PersonForm
            person={{
              name: node.data?.key,
              birthYear: node.data?.birthYear,
              netWorth: node.data?.netWorth,
              expectedLifeSpan: node.data?.expectedLifeSpan,
            }}
            setPerson={(person) => {
              diagram?.startTransaction(`Update ${person.name}`);
              const selection = e.diagram?.selection.first();
              Object.entries(person).forEach(([key, value]) => {
                console.log("trying to change", key, value);
                e.diagram?.model.setDataProperty(selection?.data, key, value);
              });
              e.diagram?.model.setDataProperty(
                selection?.data,
                "key",
                person.name
              );
              console.log("setting", person);
              diagram?.commitTransaction(`Update ${person.name}`);
            }}
          />
        );
        console.log(selectedItemForm);
      }
    }
  }

  async function initDiagram() {
    console.log("running");
    const go = await import("gojs");
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

    diagram.nodeTemplateMap.add(
      "Person",
      new go.Node("Vertical", {
        selectable: true,
        selectionAdornmentTemplate: new go.Adornment("Spot", {
          layerName: "Tool",
        })
          .add(new go.Placeholder({ padding: 10 }))
          .add(
            new go.Panel("Horizontal", {})
              .add(
                go.GraphObject.make(
                  "Button",
                  {
                    margin: 8,
                    click: addGift,
                  },
                  new go.TextBlock("Add gift", { margin: 8 })
                )
              )
              .add(
                go.GraphObject.make(
                  "Button",
                  { margin: 8, click: addGift },
                  new go.TextBlock("On death", { margin: 8 })
                )
              )
          ),
      })
        .add(
          new go.Shape("Circle", {
            fill: "gray",
            stroke: "white",
            desiredSize: new go.Size(12, 12),
            toLinkable: true,
            toSpot: go.Spot.TopSide,
            portId: "IN",
            mouseEnter: (e, port: go.GraphObject) => {
              // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "#66F";
            },
            mouseLeave: (e, port) => {
              port.fill = "gray";
            },
          })
        )
        .add(new go.Shape("Ellipse", { width: 120, height: 180, fill: "gray" }))
        .add(
          new go.TextBlock("default", {
            stroke: "red",
            font: "bold 24pt sans-serif",
            editable: true,
          }).bind("text", "key")
        )
        /*
        .add(
          new go.Panel("Horizontal")
            .add(
              go.GraphObject.make(
                "Button",
                { margin: 8, click: addPerson },
                new go.TextBlock("Add gift", { margin: 8 })
              )
            )
            .add(
              go.GraphObject.make(
                "Button",
                { margin: 8, click: addGift },
                new go.TextBlock("On death", { margin: 8 })
              )
            )
        )
        */
        .add(
          new go.Shape("Circle", {
            name: "outport",
            fill: "gray",
            stroke: "white",
            desiredSize: new go.Size(12, 12),
            fromLinkable: true,
            fromSpot: go.Spot.BottomSide,
            portId: "OUT",
            mouseEnter: (e, port: go.GraphObject) => {
              // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "#66F";
            },
            mouseLeave: (e, port) => {
              port.fill = "gray";
            },
          })
        )
    );
    diagram.linkTemplate = new go.Link({}).add(
      new go.Shape({ strokeWidth: 5 })
    );
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
        { key: "Mary", category: "Person", netWorth: null },
        { key: "Tom", category: "Person", netWorth: null },
        { key: "Tom Jr.", category: "Person", netWorth: null },
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

    setDiagram(diagram);
  }

  return (
    <main className="flex h-full flex-col">
      <h1 className="mx-auto text-4xl">New estate plan</h1>
      <button onClick={addPerson}>Add person</button>
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
