import { defaults as defaultControls } from "ol/control";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import Map from "ol/Map";
import React from "react";
import { useContext } from "react";
import "./olDefaultCss.css";
import { useGeographic } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import Select from "ol/interaction/Select";
import Translate from "ol/interaction/Translate";
import type { DrawEvent } from "ol/interaction/Draw";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import type { Geometry } from "ol/geom";
import { MapContext } from "./MapContext";
import XYZ from "ol/source/XYZ";

export interface Props {
  //zoom: number;
  //center: number[];
  selectedTool?: string;
  map: Map | undefined;
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
  setBuildingTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  setRoadTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  setTopoLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
}

function createBuildingTool(drawLayerSource: VectorSource, map: Map, selectInteraction?: Select, translateInteraction?: Translate) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "Polygon",
    stopClick: true,
  });
  drawTool.set("name", "buildings");
  //drawTool.on('drawend', (e: BaseEvent) => console.log('completed', e.feature));
  drawTool.on("drawend", (e: DrawEvent) => {
    (e.target as Draw).setActive(false);
    console.log(selectInteraction);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
    /*
        var translate = new Translate({
           features: new Collection([e.feature])
        });
        map.current?.ol.addInteraction(translate);
        */
  });
  console.log("adding interaction tool to ", map);
  map.addInteraction(drawTool);
  return drawTool;
}

function createRoadTool(drawLayerSource: VectorSource, map: Map, selectInteraction?: Select, translateInteraction?: Translate) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "LineString",
    stopClick: true,
  });
  drawTool.set("name", "roads");
  drawTool.on("drawend", (e: DrawEvent) => {
    (e.target as Draw).setActive(false);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
  });
  map.addInteraction(drawTool);

  return drawTool;
}

function createSelectTool(map: Map) {
  const selectInteraction = new Select();
  map.addInteraction(selectInteraction);
  return selectInteraction;
}

function createTranslationTool(map: Map, selectInteraction: Select) {
  const translateInteraction = new Translate({
    features: selectInteraction.getFeatures(),
  });
  map.addInteraction(translateInteraction);
  return translateInteraction;
}

export default function OlMap({ selectedTool, setMap, setBuildingTool, setRoadTool, setTopoLayer }: Props) {
  useGeographic();
  const { map, buildingTool } = useContext(MapContext);
  const [selectInteraction, setSelectInteraction] = React.useState<Select | undefined>(undefined);
  const [translateInteraction, setTranslateInteraction] = React.useState<Translate | undefined>(undefined);

  function initMap() {
    if (map !== undefined) return;
    if (document.getElementById("map")?.hasChildNodes()) return;
    const drawLayerSource = new VectorSource({ wrapX: false });
    const drawLayer: VectorLayer<VectorSource<Geometry>> = new VectorLayer({
      source: drawLayerSource,
    });

    const topoTileLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attributions: ["Powered by Esri. "],
      }),
    });
    setTopoLayer(topoTileLayer);

    const newMap = new Map({
      controls: defaultControls(),
      layers: [new TileLayer({ source: new OSM() }), drawLayer, topoTileLayer],
      target: "map",
      view: new View({
        center: [-80.90935220287511, 35.34884494150707],
        zoom: 19,
        rotation: 0,
      }),
    });
    setMap(newMap);

    const newSelectTool = createSelectTool(newMap);
    setSelectInteraction(newSelectTool);
    newSelectTool?.setActive(false);

    const newTranslateTool = createTranslationTool(newMap, newSelectTool);
    setTranslateInteraction(newTranslateTool);
    newTranslateTool?.setActive(false);

    const newRoadTool = createRoadTool(drawLayerSource, newMap, selectInteraction, translateInteraction);
    setRoadTool(newRoadTool);
    newRoadTool?.setActive(false);

    const newBuildingTool = createBuildingTool(drawLayerSource, newMap, newSelectTool, newTranslateTool);
    newBuildingTool.setActive(false);
    setBuildingTool(newBuildingTool);
  }

  React.useEffect(() => {
    initMap();
  }, []);

  return <div id="map" className="map h-full w-full"></div>;
}
