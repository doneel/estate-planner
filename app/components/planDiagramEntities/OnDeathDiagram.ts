import * as go from "gojs";
import type { OnDeath } from "../dataModels/Link";

export function updateOnDeathEntity(
  diagram: go.Diagram,
  onDeathDiagram: go.Part,
  updateParams: Partial<OnDeath>
) {
  diagram?.startTransaction(`Update ${onDeathDiagram.data.to}`);
  Object.entries(updateParams).forEach(([key, value]) => {
    console.log("setting", key, value);
    diagram.model.setDataProperty(onDeathDiagram?.data, `${key}`, value);
  });
  diagram?.commitTransaction(`Update ${onDeathDiagram.data.to}`);
}

export const OnDeathDiagram = new go.Link({
  fromEndSegmentLength: 160,
  toEndSegmentLength: 160,
  curve: go.Link.Bezier,
  routing: go.Link.Normal,
  relinkableFrom: true,
  relinkableTo: true,
  selectionAdorned: false,
  selectionChanged: (e: go.Part) => {
    e.isHighlighted = !e.isHighlighted;
  },
  mouseEnter: (e, link) => {
    // @ts-ignore
    link.elt(0).stroke = "rgba(0,90,156,0.3)";
  },
  mouseLeave: (e, link) => {
    // @ts-ignore
    link.elt(0).stroke = "transparent";
  },
})

  .add(
    new go.Shape({ isPanelMain: true, stroke: "transparent", strokeWidth: 8 })
  )
  .add(
    new go.Shape({ isPanelMain: true, strokeWidth: 2, stroke: "black" }).bind(
      "stroke",
      "fromPort",
      (fromPort) => {
        if (fromPort === "wifeport") {
          return "pink";
        } else if (fromPort === "husbandport") {
          return "#749ced";
        } else {
          return "black";
        }
      }
    )
  )
  .add(
    new go.Shape({ toArrow: "Standard" })
      .bind("fill", "fromPort", (fromPort) => {
        if (fromPort === "wifeport") {
          return "pink";
        } else if (fromPort === "husbandport") {
          return "#749ced";
        } else {
          return "black";
        }
      })
      .bind("stroke", "fromPort", (fromPort) => {
        if (fromPort === "wifeport") {
          return "pink";
        } else if (fromPort === "husbandport") {
          return "#749ced";
        } else {
          return "black";
        }
      })
  )
  .add(
    new go.Panel("Auto", {
      segmentOrientation: go.Link.None, //go.Link.OrientUpright,
    })
      .bind("segmentOrientation", "linksSharingTarget", (count) =>
        count > 1 ? go.Link.OrientUpright : go.Link.None
      )
      .add(
        new go.Shape("RoundedRectangle", {
          strokeWidth: 0,
          stroke: "black",
          fill: "white",
          opacity: 0.75,
        })
          .bind(
            new go.Binding("opacity", "value", (value) => {
              return value.description === undefined ? 0 : 0.5;
            })
          )
          .bind(
            new go.Binding("opacity", "isHighlighted", (isHighlighted) => {
              return isHighlighted ? 1 : 0.75;
            }).ofObject()
          )
          .bind(
            new go.Binding("strokeWidth", "isHighlighted", (isHighlighted) => {
              return isHighlighted ? 1 : 0;
            }).ofObject()
          )
      )
      .add(
        new go.Panel("Vertical", { margin: 4, alignment: go.Spot.Left }).add(
          new go.TextBlock("", {
            alignment: go.Spot.Left,
            font: "16pt bold sans-serif",
            stroke: "black",
          })
            .bind("text", "", (node) => node.value.description)
            .bind(
              new go.Binding("stroke", "isHighlighted", (isHighlighted) => {
                return isHighlighted ? "black" : "black";
              }).ofObject()
            )
        )
      )
  );
