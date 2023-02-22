import type { DrawEvent } from "ol/interaction/Draw";
import type Draw from "ol/interaction/Draw";
import type Map from "ol/Map";
import type Select from "ol/interaction/Select";
import type Translate from "ol/interaction/Translate";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useState } from "react";
import React from "react";
import OlMap from "./OlMap";
import type { SavedPolygon } from "./MapContext";
import { MapContext } from "./MapContext";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import type Geometry from "ol/geom/Geometry";
import type TileLayer from "ol/layer/Tile";
import type { OSM, TileWMS, XYZ } from "ol/source";

export interface Props {}

export default function MapAndControls({ children }: Props & PropsWithChildren) {
  const [selectedTool, setSelectedTool] = useState<string>();
  const [buildingTool, setBuildingTool] = React.useState<Draw | undefined>(undefined);
  const [roadTool, setRoadTool] = React.useState<Draw | undefined>(undefined);
  const [parkingTool, setParkingTool] = React.useState<Draw | undefined>(undefined);
  const [topoLayer, setTopoLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [parcelLayer, setParcelLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [streetLayer, setStreetLayer] = React.useState<TileLayer<OSM> | undefined>(undefined);
  const [tonerLayer, setTonerLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [wetlandsLayer, setWetlandsLayer] = React.useState<TileLayer<TileWMS> | undefined>(undefined);

  const [buildingLibrary, setBuildingLibrary] = React.useState<SavedPolygon[]>([]);

  const [map, setMap] = React.useState<Map | undefined>(undefined);

  return (
    <MapContext.Provider
      value={{
        map,
        buildingTool,
        roadTool,
        topoLayer,
        parcelLayer,
        parkingTool,
        streetLayer,
        tonerLayer,
        wetlandsLayer,
        project: {
          featuresGeoJson: JSON.parse("{}"),
          buildingLibrary,
          setBuildingLibrary,
        },
      }}
    >
      {/* Primary column */}
      <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last">
        <h1 id="primary-heading" className="sr-only">
          Home
        </h1>
        {/* Your content */}
        <OlMap
          selectedTool={selectedTool}
          map={map}
          setMap={setMap}
          setBuildingTool={setBuildingTool}
          setRoadTool={setRoadTool}
          setParkingTool={setParkingTool}
          setTopoLayer={setTopoLayer}
          setParcelLayer={setParcelLayer}
          setStreetLayer={setStreetLayer}
          setTonerLayer={setTonerLayer}
          setWetlandsLayer={setWetlandsLayer}
        />
      </section>

      {/* Secondary column (hidden on smaller screens) */}
      <aside className="hidden lg:order-first lg:block lg:flex-shrink-0">
        <div className="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-100">
          {children}
          {/* Your content */}
        </div>
      </aside>
    </MapContext.Provider>
  );
}
