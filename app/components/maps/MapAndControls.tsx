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

export interface Props {}

export default function MapAndControls({ children }: Props & PropsWithChildren) {
  const [selectedTool, setSelectedTool] = useState<string>();
  const [buildingTool, setBuildingTool] = React.useState<Draw | undefined>(undefined);
  const [roadTool, setRoadTool] = React.useState<Draw | undefined>(undefined);
  const [stepbackTool, setStepbackTool] = React.useState<Draw | undefined>(undefined);
  const [parkingTool, setParkingTool] = React.useState<Draw | undefined>(undefined);
  const [topoLayer, setTopoLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [parcelLayer, setParcelLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [streetLayer, setStreetLayer] = React.useState<TileLayer<OSM> | undefined>(undefined);
  const [tonerLayer, setTonerLayer] = React.useState<TileLayer<XYZ> | undefined>(undefined);
  const [wetlandsLayer, setWetlandsLayer] = React.useState<TileLayer<TileWMS> | undefined>(undefined);
  const [contourLayer, setContourLayer] = React.useState<ImageLayer<ImageArcGISRest> | undefined>(undefined);
  const [slopeLayer, setSlopeLayer] = React.useState<ImageLayer<ImageArcGISRest> | undefined>(undefined);

  const [buildingLibrary, setBuildingLibrary] = React.useState<ISavedPolygon[]>([]);

  const [map, setMap] = React.useState<Map | undefined>(undefined);

  const [savedPlan, setSavedPlan] = useLocalStorageState<string | undefined>("site-plan", undefined);

  const format = new GeoJSON();
  function saveProject() {
    console.log("Saving...");
    const layerNames = ["draw", "stepback"];
    const layersToSave = map
      ?.getAllLayers()
      //.getArray()
      .filter((layer) => layerNames.includes(layer.get("type")));
    //console.log("Saving layers", layersToSave);
    //console.log((layersToSave ?? []).map((l) => l.getSource() as VectorSource<Geometry>).map((source) => source.getFeatures()));
    const featuresByLayer = (layersToSave ?? [])
      .map<[string, VectorSource<Geometry>]>((l) => [l.get("type"), l.getSource() as VectorSource<Geometry>])
      .flatMap<[string, Feature<Geometry>]>(([name, source]) => source.getFeatures().map<[string, Feature<Geometry>]>((f) => [name, f]))
      .map<[string, GeoJSONFeature]>(([name, feature]) => [name, format.writeFeatureObject(feature)]);

    const project: Project = new Project(
      featuresByLayer.filter(([name, feature]) => name === "stepback").map(([name, feature]) => feature),
      featuresByLayer.filter(([name, feature]) => name === "draw").map(([name, feature]) => feature),
      buildingLibrary.map((data) => new SavedPolygon(data))
    );
    setSavedPlan(JSON.stringify(defaultSerializer.serialize(project)));
  }

  function loadProject(map: Map) {
    if (!savedPlan) {
      return;
    }
    const project = defaultSerializer.deserializeObject(savedPlan, Project);
    if (project) {
      setBuildingLibrary(project.buildingLibrary);
      const drawFeatures = project.drawLayerFeatures.map((geoJsonFeature) => format.readFeature(geoJsonFeature));
      const drawLayerSource = map
        ?.getAllLayers()
        .find((layer) => layer.get("type") === "draw")
        ?.getSource();
      console.log("source", drawLayerSource);
      if (drawLayerSource) {
        (drawLayerSource as VectorSource<Geometry>).addFeatures(drawFeatures);
      }

      const stepbackFeatures = project.stepbackLayerFeatures.map((geoJsonFeature) => format.readFeature(geoJsonFeature));
      const stepbackLayerSource = map
        ?.getAllLayers()
        .find((layer) => layer.get("type") === "stepback")
        ?.getSource();
      console.log("source", stepbackLayerSource);
      if (stepbackLayerSource) {
        (stepbackLayerSource as VectorSource<Geometry>).addFeatures(stepbackFeatures);
      }
    }
  }

  return (
    <MapContext.Provider
      value={{
        map,
        saveProject,
        buildingTool,
        roadTool,
        parkingTool,
        stepbackTool,
        topoLayer,
        parcelLayer,
        streetLayer,
        tonerLayer,
        wetlandsLayer,
        contourLayer,
        slopeLayer,
        loadProject,
        buildingLibrary,
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
          setStepbackTool={setStepbackTool}
          setParkingTool={setParkingTool}
          setTopoLayer={setTopoLayer}
          setParcelLayer={setParcelLayer}
          setStreetLayer={setStreetLayer}
          setTonerLayer={setTonerLayer}
          setWetlandsLayer={setWetlandsLayer}
          setContourLayer={setContourLayer}
          setSlopeLayer={setSlopeLayer}
          setBuildingLibrary={setBuildingLibrary}
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
