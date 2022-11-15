import go from "gojs";
import { useEffect } from "react";
import { recomputeDiagram } from "../dataModels/Model";
import { NodeType } from "../dataModels/Node";
import { defaultStartingModel } from "../planDiagramEntities/diagram";
import DiagramControlButton from "./DiagramControlButton";

export type Props = {
  diagram: go.Diagram;
};
export default function DiagramControls({ diagram }: Props) {
  useEffect(() => {
    async function importFlowbite() {
      // @ts-ignore
      await import("../../../node_modules/flowbite/dist/flowbite");
    }
    importFlowbite();
  });

  function dragStart(event: DragEvent) {
    // @ts-ignore
    if (!event.target?.className.includes("draggable")) return;

    /* Set drag icon to look like the image we're going to dro in */
    const dragIcon = document.createElement("img");
    dragIcon.src = "/images/rendered-stickynote.png";
    dragIcon.style.position = "absolute";
    document.body.appendChild(dragIcon);
    event.dataTransfer?.setDragImage(dragIcon, 0, 0);
  }

  function dragend(event: DragEvent) {}

  function canvasDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  function canvasDragover(event: DragEvent) {
    event.preventDefault();
  }

  function canvasDragleave(event: DragEvent) {}

  function canvasDrop(event: DragEvent) {
    event.preventDefault();

    // Dragging onto a Diagram
    const can = event.target;
    const pixelratio = diagram.computePixelRatio();

    // if the target is not the canvas, we may have trouble, so just quit:
    if (!(can instanceof HTMLCanvasElement)) return;

    const bbox = can.getBoundingClientRect();
    let bbw = bbox.width;
    if (bbw === 0) bbw = 0.001;
    let bbh = bbox.height;
    if (bbh === 0) bbh = 0.001;
    const mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
    const my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
    const point = diagram.transformViewToDoc(new go.Point(mx, my));

    diagram.startTransaction("new node");
    const newdata = {
      location: go.Point.stringify(point),
      key: "stickynote",
      category: "Stickynote",
      text: "Example text",
    };

    diagram.model.addNodeData(newdata);
    const newnode = diagram.findNodeForData(newdata);
    if (newnode) {
      diagram.select(newnode);
    }
    diagram.commitTransaction("new node");
  }

  useEffect(() => {
    document.addEventListener("dragstart", dragStart);
    // This event resets styles after a drag has completed (successfully or not)
    document.addEventListener("dragend", dragend, false);
    // Next, events intended for the drop target - the Diagram div
    const div = document.getElementById("myDiagramDiv");
    div?.addEventListener("dragenter", canvasDragEnter, false);
    div?.addEventListener("dragover", canvasDragover, false);
    div?.addEventListener("dragleave", canvasDragleave, false);
    div?.addEventListener("drop", canvasDrop, false);

    return () => {
      document.removeEventListener("dragstart", dragStart);
      document.removeEventListener("dragend", dragend, false);
      div?.removeEventListener("dragenter", canvasDragEnter, false);
      div?.removeEventListener("dragover", canvasDragover, false);
      div?.removeEventListener("dragleave", canvasDragleave, false);
      div?.removeEventListener("drop", canvasDrop, false);
    };
  }, []);

  return (
    <div className="align-items-center flex max-h-72 flex-col  rounded-lg bg-slate-50 px-1 py-1">
      <DiagramControlButton
        id="trust"
        svgPath="/images/trust.svg"
        tooltipText="Add a trust"
        onClick={() => {
          if (diagram !== undefined) {
            diagram.model.commit(function (m: go.Model) {
              const nodeData = {
                key: "New Trust",
                name: "New Trust",
                category: NodeType.Trust,
              };
              m.addNodeData(nodeData);
              const node = diagram.findNodeForData(nodeData);
              diagram.select(node);
              if (node !== null) {
                diagram.centerRect(node.actualBounds);
              }
            }, "Add a new trust");
          }
        }}
      />

      <DiagramControlButton
        id="person"
        svgPath="/images/person.svg"
        tooltipText="Add a beneficiary"
        onClick={() => {
          if (diagram !== undefined) {
            diagram.model.commit(function (m: go.Model) {
              const nodeData = {
                key: "New Beneficiary",
                category: "Beneficiary",
              };
              m.addNodeData(nodeData);
              diagram.select(diagram.findNodeForData(nodeData));
            }, "Add a new beneficiary");
          }
        }}
      />

      <DiagramControlButton
        id="stickynote"
        svgPath="/images/stickynote.svg"
        draggable={true}
        tooltipText="Stickynote"
        onClick={() => {}}
      />

      <DiagramControlButton
        id="undo"
        svgPath="/images/undo.svg"
        tooltipText="Undo"
        onClick={() => {
          alert("No undo yet, sorry!");
        }}
      />

      <DiagramControlButton
        id="reset"
        svgPath="/images/reset.svg"
        tooltipText="Start over"
        onClick={() => {
          diagram.model = defaultStartingModel();
          recomputeDiagram(diagram, undefined);
        }}
      />
      <img
        src="/images/rendered-stickynote.png"
        className="hidden"
        alt="Hidden preloading"
      />
    </div>
  );
}
