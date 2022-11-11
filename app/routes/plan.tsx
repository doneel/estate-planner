import BrowserOnly from "~/components/BrowserOnly";

export default function Plan() {
  return (
    <BrowserOnly
      importElementFn={() =>
        import("~/components/diagramWorkspace/FullPagePlan")
      }
    />
  );
}
