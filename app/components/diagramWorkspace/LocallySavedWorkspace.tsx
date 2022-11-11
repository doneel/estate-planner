import useLocalStorageState from "~/hooks/useLocalStorageState";
import type { Props as DiagramWorkspaceProps } from "./DiagramWorkspace";
import DiagramWorkspace from "./DiagramWorkspace";

export type Props = Omit<DiagramWorkspaceProps, "initialPlan" | "savePlan">;

export default function LocallySavedWorkspace(props: Props) {
  const [savedPlan, setSavedPlan] = useLocalStorageState<string | undefined>(
    "plan",
    undefined
  );

  return (
    <DiagramWorkspace
      diagramDivId="myDiagramDiv"
      diagram={props.diagram}
      setDiagram={props.setDiagram}
      initialPlan={savedPlan}
      savePlan={setSavedPlan}
      sidebarContent={props.sidebarContent}
      setSidebarContent={props.setSidebarContent}
    />
  );
}
