import { defaults as defaultControls } from "ol/control";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import Map from "ol/Map";
import React from "react";
import { useContext } from "react";
import { useGeographic } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import Select from "ol/interaction/Select";
import Translate from "ol/interaction/Translate";
import type { DrawEvent } from "ol/interaction/Draw";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import type { Geometry, Polygon } from "ol/geom";
import { LineString } from "ol/geom";
import type { LongLat, SavedPolygon } from "./MapContext";
import { MapContext } from "./MapContext";
import XYZ from "ol/source/XYZ";
import { formatArea, formatLength, styleFunction } from "./interactiveMapStyles";
import { v4 as uuidv4 } from "uuid";
import Stamen from "ol/source/Stamen";
import type { Feature } from "ol";
import { defaultFillStyle } from "ol/render/canvas";
import Style from "ol/style/Style";
import type { FeatureLike } from "ol/Feature";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { TileWMS } from "ol/source";
import { getArea } from "ol/Sphere";

export interface Props {
  //zoom: number;
  //center: number[];
  selectedTool?: string;
  map: Map | undefined;
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
  setBuildingTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  setRoadTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  setParkingTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  setTopoLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setParcelLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setTonerLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setStreetLayer: React.Dispatch<React.SetStateAction<TileLayer<OSM> | undefined>>;
  setWetlandsLayer: React.Dispatch<React.SetStateAction<TileLayer<TileWMS> | undefined>>;
}

function createBuildingTool(drawLayerSource: VectorSource, map: Map, selectInteraction: Select, translateInteraction: Translate, addBuildingToLibrary: (b: SavedPolygon) => void) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "Polygon",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "Polygon", "");
    },
  });
  drawTool.set("name", "buildings");

  drawTool.on("drawend", (e: DrawEvent) => {
    const coordinates: number[][] = (e.feature.getGeometry() as Polygon).getCoordinates()[0];
    const firstCoords = coordinates[0];
    const lengths: string[] = [];
    new LineString(coordinates).forEachSegment((start, end) => {
      lengths.push(formatLength(new LineString([start, end])));
    });
    const polygon = {
      id: uuidv4(),
      points: coordinates.map<LongLat>((c) => {
        return { long: c[0] - firstCoords[0], lat: c[1] - firstCoords[1] };
      }),
      dimensions: lengths,
      area: formatArea(e.feature.getGeometry() as Polygon),
    };
    addBuildingToLibrary(polygon);
    (e.target as Draw).setActive(false);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
  });
  map.addInteraction(drawTool);
  return drawTool;
}

function createRoadTool(drawLayerSource: VectorSource, map: Map, selectInteraction?: Select, translateInteraction?: Translate) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "LineString",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "LineString", "");
    },
  });
  drawTool.set("name", "roads");
  drawTool.on("drawend", (e: DrawEvent) => {
    e.feature.set("type", "road");
    (e.target as Draw).setActive(false);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
  });
  map.addInteraction(drawTool);

  return drawTool;
}

function createParkingTool(drawLayerSource: VectorSource, map: Map, selectInteraction?: Select, translateInteraction?: Translate) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "Polygon",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "Polygon", "");
    },
  });
  drawTool.set("name", "parking");
  drawTool.on("drawend", (e: DrawEvent) => {
    e.feature.set("type", "parking");
    (e.target as Draw).setActive(false);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
  });

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

export default function OlMap({ selectedTool, setMap, setBuildingTool, setRoadTool, setParkingTool, setTopoLayer, setParcelLayer, setStreetLayer, setTonerLayer, setWetlandsLayer }: Props) {
  const {
    map,
    buildingTool,
    project: { buildingLibrary, setBuildingLibrary },
  } = useContext(MapContext);
  const [selectInteraction, setSelectInteraction] = React.useState<Select | undefined>(undefined);
  const [translateInteraction, setTranslateInteraction] = React.useState<Translate | undefined>(undefined);

  function initMap() {
    if (map !== undefined) return;
    if (document.getElementById("map")?.hasChildNodes()) return;
    const drawLayerSource = new VectorSource({ wrapX: false });
    const drawLayer: VectorLayer<VectorSource<Geometry>> = new VectorLayer({
      source: drawLayerSource,
      style: function (feature: FeatureLike, resolution) {
        if (feature.get("type") === "building") {
          console.log("FOUND A BUILDING", feature);
          return new Style({
            stroke: new Stroke({
              color: "black",
              width: 4,
            }),
            fill: new Fill({
              color: "#CCCCCC77",
            }),
          });
        }
        if (feature.get("type") === "road") {
          const roadWidthMeters = 10;
          return [
            new Style({
              stroke: new Stroke({
                color: "black",
                width: roadWidthMeters / resolution,
              }),
            }),
            new Style({
              stroke: new Stroke({
                color: "white",
                width: roadWidthMeters / resolution - 1,
              }),
            }),
          ];
        }
        if (feature.get("type") === "parking") {
          return new Style({
            fill: new Fill({ color: "#AAAAAA99" }),
            stroke: new Stroke({
              color: "white",
              width: 2,
            }),
          });
        }
      },
    });
    drawLayer.set("type", "draw");

    const wetlandsLayer = new TileLayer({
      source: new TileWMS({
        url: "https://fwspublicservices.wim.usgs.gov/wetlandsmapservice/services/Wetlands/MapServer/WMSServer/",
        params: { TILED: true, layers: 1 },
      }),
    });
    setWetlandsLayer(wetlandsLayer);
    wetlandsLayer.setVisible(false);

    const topoTileLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attributions: ["Powered by Esri. "],
      }),
    });
    topoTileLayer.setVisible(false);
    setTopoLayer(topoTileLayer);

    const parcelTileLayer = new TileLayer({
      source: new XYZ({
        url: "https://tiles.regrid.com/api/v1/parcels/{z}/{x}/{y}.png?token=WkKgQzMANAdxfc9R0HgNellvzv4PG3PRxeaBpGPnE1MXfKtiLs04qgU1yjIAQmTW&format=mvt",
      }),
    });
    setParcelLayer(parcelTileLayer);
    parcelTileLayer.setVisible(false);

    const osmLayer = new TileLayer({ source: new OSM() });
    osmLayer.setVisible(true);
    setStreetLayer(osmLayer);

    const tonerLayer = new TileLayer({
      source: new Stamen({ layer: "toner" }),
    });
    tonerLayer.setVisible(false);
    setTonerLayer(tonerLayer);

    const newMap = new Map({
      controls: defaultControls(),
      layers: [osmLayer, topoTileLayer, parcelTileLayer, tonerLayer, wetlandsLayer, drawLayer],
      target: "map",
      view: new View({
        //center: [-80.90935220287511, 35.34884494150707],
        center: [-9006787.887637684, 4211389.412959919],
        //center: [-11000000, 4600000],
        zoom: 19,
        //rotation: 0,
      }),
    });
    setMap(newMap);

    const newSelectTool = createSelectTool(newMap);
    setSelectInteraction(newSelectTool);
    newSelectTool?.setActive(false);

    const newTranslateTool = createTranslationTool(newMap, newSelectTool);
    setTranslateInteraction(newTranslateTool);
    newTranslateTool?.setActive(false);

    const newRoadTool = createRoadTool(drawLayerSource, newMap, newSelectTool, newTranslateTool);
    setRoadTool(newRoadTool);
    newRoadTool?.setActive(false);

    const newBuildingTool = createBuildingTool(drawLayerSource, newMap, newSelectTool, newTranslateTool, (b) => {
      setBuildingLibrary((currentState) => [...currentState, b]);
    });
    newBuildingTool.setActive(false);
    setBuildingTool(newBuildingTool);

    const newParkingTool = createParkingTool(drawLayerSource, newMap, newSelectTool, newTranslateTool);
    setParkingTool(newParkingTool);
    newParkingTool.setActive(false);
  }

  React.useEffect(() => {
    initMap();
  }, []);

  return <div id="map" className="map h-full w-full"></div>;
}
