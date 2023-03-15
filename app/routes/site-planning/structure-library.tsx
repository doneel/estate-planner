import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useContext, useRef, useState } from "react";
import { CheckIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { MapContext } from "~/components/maps/MapContext";
import BrowserOnly from "~/components/BrowserOnly";

export default function BuildingLibraryPage() {
  return <BrowserOnly importElementFn={() => import("~/components/site-planning/StructureLibraryContainer")} />;
}
