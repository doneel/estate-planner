import { defaults as defaultControls, ScaleLine } from "ol/control";
import TileLayer from "ol/layer/Tile";
import GeoJSON from "ol/format/GeoJSON";
import { buffer, intersect } from "@turf/turf";
import OSM from "ol/source/OSM";
import View from "ol/View";
import Map from "ol/Map";
import React from "react";
import { useContext } from "react";
import { Vector as VectorLayer } from "ol/layer";
import Select from "ol/interaction/Select";
import ImageLayer from "ol/layer/Image";
import Translate from "ol/interaction/Translate";
import type { DrawEvent } from "ol/interaction/Draw";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import type { Geometry, Polygon } from "ol/geom";
import { LineString } from "ol/geom";
import type { LongLat, ISavedPolygon } from "./MapContext";
import { MapContext } from "./MapContext";
import XYZ from "ol/source/XYZ";
import { formatArea, formatLength, styleFunction } from "./interactiveMapStyles";
import { v4 as uuidv4 } from "uuid";
import Stamen from "ol/source/Stamen";
import type { Feature } from "ol";
import Style from "ol/style/Style";
import type { FeatureLike } from "ol/Feature";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { ImageArcGISRest, TileWMS } from "ol/source";
import type { Feature as GJFeature, Polygon as GJPolygon } from "geojson";
import type { GeoJsonProperties } from "geojson";
import { getUsableParkingLot } from "~/routes/site-planning/map/parking";

export interface Props {}

const format = new GeoJSON();
function createBuildingTool(drawLayerSource: VectorSource, map: Map, selectInteraction: Select, translateInteraction: Translate, addBuildingToLibrary: (b: ISavedPolygon) => void) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "Polygon",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "Polygon");
    },
  });
  drawTool.set("name", "buildings");

  drawTool.on("drawend", (e: DrawEvent) => {
    e.feature.set("type", "building");
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
      return styleFunction(feature, true, "LineString");
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

function createStepbackTool(stepbackLayerSource: VectorSource, map: Map, selectInteraction?: Select, translateInteraction?: Translate) {
  const drawTool = new Draw({
    source: stepbackLayerSource,
    type: "LineString",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "LineString");
    },
  });
  drawTool.on("drawend", (e: DrawEvent) => {
    const lineClone = e.feature.clone();
    lineClone.getGeometry()?.transform("EPSG:3857", "EPSG:4326");
    const geoJson = format.writeFeatureObject(lineClone) as GJFeature<GJPolygon, GeoJsonProperties>;
    const setbackBufferTurf = buffer(geoJson, 10, { units: "meters" });
    const setBackBuffer = format.readFeature(setbackBufferTurf);
    setBackBuffer?.getGeometry()?.transform("EPSG:4326", "EPSG:3857");
    setBackBuffer.set("type", "stepbackBorder");
    stepbackLayerSource.addFeature(setBackBuffer);
    e.feature.set("type", "stepbackLine");
    (e.target as Draw).setActive(false);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
  });
  map.addInteraction(drawTool);

  return drawTool;
}

function createParkingTool(drawLayerSource: VectorSource, map: Map, selectInteraction: Select, translateInteraction: Translate, addParkingLot: (lot: Feature<Geometry>) => void) {
  const drawTool = new Draw({
    source: drawLayerSource,
    type: "Polygon",
    stopClick: true,
    style: function (feature) {
      return styleFunction(feature, true, "Polygon");
    },
  });
  drawTool.set("name", "parking");
  drawTool.on("drawend", (e: DrawEvent) => {
    e.feature.set("type", "parking");
    (e.target as Draw).setActive(false);
    const internalRect = getUsableParkingLot(e.feature);
    drawLayerSource.addFeature(internalRect);
    selectInteraction?.setActive(true);
    translateInteraction?.setActive(true);
    addParkingLot(e.feature);
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

export default function OlMap({}: Props) {
  const {
    map,
    loadProject,
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
  } = useContext(MapContext);
  const [selectInteraction, setSelectInteraction] = React.useState<Select | undefined>(undefined);
  const [translateInteraction, setTranslateInteraction] = React.useState<Translate | undefined>(undefined);

  function initMap() {
    console.log(map, map !== undefined);
    if (document.getElementById("map")?.hasChildNodes()) return;
    const stepbackLayerSource = new VectorSource({ wrapX: false });
    const stepbackLayer: VectorLayer<VectorSource<Geometry>> = new VectorLayer({
      source: stepbackLayerSource,
      style: function (feature: FeatureLike, resolution) {
        const stepBackDistanceMeters = 10;
        return [
          new Style({
            stroke: new Stroke({
              color: "#FF3333",
              width: 1, //stepBackDistanceMeters / resolution,
            }),
            fill: new Fill({
              color: "#FF222233",
            }),
          }),
          /*
          new Style({
            stroke: new Stroke({
              color: "#FF000022",
              width: stepBackDistanceMeters / resolution - 1,
            }),
          }),
          */
        ];
      },
    });
    stepbackLayer.set("type", "stepback");

    const drawLayerSource = new VectorSource({ wrapX: false });
    const drawLayer: VectorLayer<VectorSource<Geometry>> = new VectorLayer({
      source: drawLayerSource,
      style: function (feature: FeatureLike, resolution) {
        if (feature.get("type") === "building") {
          const stepbackGeoJson: GJFeature<GJPolygon, GeoJsonProperties>[] = [];
          stepbackLayerSource.forEachFeature((feature) => {
            if (feature.get("type") === "stepbackBorder") {
              stepbackGeoJson.push(format.writeFeatureObject(feature) as GJFeature<GJPolygon, GeoJsonProperties>);
            }
          });
          const buildingGeoFeature: GJFeature<GJPolygon, GeoJsonProperties> = format.writeFeatureObject(feature as Feature<Polygon>) as GJFeature<GJPolygon, GeoJsonProperties>;
          const safe = stepbackGeoJson.every((stepback) => intersect(stepback, buildingGeoFeature) === null);
          if (!safe) {
            return new Style({
              stroke: new Stroke({
                color: "red",
                width: 4,
              }),
              fill: new Fill({
                color: "#CCCCCC77",
              }),
            });
          } else {
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
            fill: new Fill({ color: "#AAAAAA11" }),
            stroke: new Stroke({
              color: "#FFF",
              width: 2,
            }),
          });
        }
        if (feature.get("type") === "parking-internal-rect") {
          var offset = 6;
          return new Style({
            fill: new Fill({ color: "#AAAAAA33" }),
            stroke: new Stroke({
              color: "#888",
              width: 1,
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

    const contourLayer = new ImageLayer({
      source: new ImageArcGISRest({
        ratio: 1,
        params: { renderingRule: '{"rasterFunction":"Contour 25","rasterFunctionArguments":{"ContourInterval":0.3048,"ZBase":1,"NumberOfContours":0}}' },
        url: "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer",
      }),
      visible: false,
      opacity: 0.5,
    });
    setContourLayer(contourLayer);

    const slopeLayer = new ImageLayer({
      source: new ImageArcGISRest({
        ratio: 1,
        params: { renderingRule: '{"rasterFunction":"Slope Map"}' },
        url: "https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer",
      }),
      visible: false,
      opacity: 0.5,
    });
    setSlopeLayer(slopeLayer);

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
      layers: [osmLayer, topoTileLayer, contourLayer, slopeLayer, tonerLayer, parcelTileLayer, wetlandsLayer, stepbackLayer, drawLayer],
      target: "map",
      view: new View({
        center: [-9006787.887637684, 4211389.412959919],
        zoom: 19,
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
      console.log("trying to save");
      if (setBuildingLibrary === undefined) {
        console.log("Can't save, hooks not initialized.");
        return;
      }
      setBuildingLibrary((currentState) => [...currentState, b]);
    });
    newBuildingTool.setActive(false);
    setBuildingTool(newBuildingTool);

    const newParkingTool = createParkingTool(drawLayerSource, newMap, newSelectTool, newTranslateTool, (lot) => {
      setParkingLots((currentState) => [...currentState, lot]);
    });
    setParkingTool(newParkingTool);
    newParkingTool.setActive(false);

    const newStepbackTool = createStepbackTool(stepbackLayerSource, newMap, newSelectTool, newTranslateTool);
    setStepbackTool(newStepbackTool);
    newStepbackTool.setActive(false);

    const scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 125, units: "imperial" });
    newMap.addControl(scaleLine);

    if (loadProject) {
      console.log("All layers now", newMap.getAllLayers());
      loadProject(newMap);
    }
  }

  React.useEffect(() => {
    initMap();
  }, []);

  return <div id="map" className="map h-full w-full"></div>;
}
