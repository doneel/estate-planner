import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode, ComponentType } from "react";

export function ClientOnly({ children }: { children: ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}
export type Props = {
  //child: Promise<JSX.Element>;
  //childModule: string;
  importElementFn: () => Promise<{ default: ComponentType<any> }>;
};

export default function BrowserOnly({ importElementFn }: Props) {
  //let PlanComponent = lazy(() => import("./FullPagePlan"));
  //console.log(childModule);
  //const x = "~/components/FullPagePlan";
  //let PlanComponent2 = lazy(() => import("~/components/FullPagePlan"));
  let PlanComponent = lazy(importElementFn);
  //let PlanComponent = lazy(() => x);
  return (
    <>
      <ClientOnly>
        <Suspense fallback="">
          <PlanComponent />
        </Suspense>
      </ClientOnly>
    </>
  );
}
