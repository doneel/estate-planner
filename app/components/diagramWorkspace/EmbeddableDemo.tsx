import React from "react";
import LocallySavedWorkspace from "./LocallySavedWorkspace";

export default function EmbeddableDemo() {
  const [diagram, setDiagram] = React.useState<go.Diagram | undefined>(
    undefined
  );
  const [selectedItemForm, setSelectedItemForm] = React.useState(<></>);

  return (
    <LocallySavedWorkspace
      diagramDivId="myDiagramDiv"
      diagram={diagram}
      setDiagram={setDiagram}
      sidebarContent={selectedItemForm}
      setSidebarContent={setSelectedItemForm}
    />
  );
}
