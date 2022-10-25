import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";

let PlanComponent = lazy(() => import("../components/Plan"));

export function ClientOnly({ children }: { children: ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

export default function PlanPage() {
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
