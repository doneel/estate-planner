import type { DrawEvent } from "ol/interaction/Draw";
import type Draw from "ol/interaction/Draw";
import type { GeoJSONFeature } from "ol/format/GeoJSON";
import GeoJSON from "ol/format/GeoJSON";
import type Map from "ol/Map";
import type Select from "ol/interaction/Select";
import type Translate from "ol/interaction/Translate";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useState } from "react";
import React from "react";
import OlMap from "./OlMap";
import type { ISavedPolygon } from "./MapContext";
import { SavedPolygon } from "./MapContext";
import { defaultSerializer } from "./MapContext";
import { IProject, Project } from "./MapContext";
import { MapContext } from "./MapContext";
import type VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import type Geometry from "ol/geom/Geometry";
import type TileLayer from "ol/layer/Tile";
import type { ImageArcGISRest, OSM, TileWMS, XYZ } from "ol/source";
import useLocalStorageState from "~/hooks/useLocalStorageState";
import type Feature from "ol/Feature";
import type ImageLayer from "ol/layer/Image";
import SitePlanningContextProvider from "../site-planning/SitePlanningContextProvider";

export interface Props {}

export default function MapAndControls({ children }: Props & PropsWithChildren) {
  return (
    <>
      <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last">
        <h1 id="primary-heading" className="sr-only">
          Home
        </h1>
        {/* Your content */}
        <OlMap />
      </section>

      {/* Secondary column (hidden on smaller screens) */}
      <aside className="hidden lg:order-first lg:block lg:flex-shrink-0">
        <div className="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-100">
          {children}
          {/* Your content */}
        </div>
      </aside>
    </>
  );
}
