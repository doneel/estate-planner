import type { DrawEvent } from "ol/interaction/Draw";
import type Draw from "ol/interaction/Draw";
import type { GeoJSONFeature } from "ol/format/GeoJSON";
import GeoJSON from "ol/format/GeoJSON";
import type Map from "ol/Map";
import type Select from "ol/interaction/Select";
import type Translate from "ol/interaction/Translate";
import type { PropsWithChildren } from "react";
import React from "react";
import type VectorSource from "ol/source/Vector";
import type Geometry from "ol/geom/Geometry";
import type TileLayer from "ol/layer/Tile";
import type { ImageArcGISRest, OSM, TileWMS, XYZ } from "ol/source";
import useLocalStorageState from "~/hooks/useLocalStorageState";
import type Feature from "ol/Feature";
import type ImageLayer from "ol/layer/Image";
import type { ISavedPolygon } from "../maps/MapContext";
import { Project, SavedPolygon, MapContext } from "../maps/MapContext";
import { JsonSerializer, throwError } from "typescript-json-serializer";

export const defaultSerializer = new JsonSerializer({
  // Throw errors instead of logging
  errorCallback: throwError,

  // Allow all nullish values
  nullishPolicy: {
    undefined: "allow",
    null: "allow",
  },
});

export default function SitePlanningContextProvider({ children }: PropsWithChildren) {
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
  const [parkingLots, setParkingLots] = React.useState<Feature<Geometry>[]>([]);

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
      /* TODO load parking layers and put in parkingLots hook */
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
        setMap,
        setBuildingTool,
        setRoadTool,
        setParkingTool,
        setStepbackTool,
        setTopoLayer,
        setParcelLayer,
        setStreetLayer,
        setTonerLayer,
        setWetlandsLayer,
        setContourLayer,
        setSlopeLayer,
        setBuildingLibrary,
        setParkingLots,
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
        parkingLots,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
