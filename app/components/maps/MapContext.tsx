import React from "react";
import type { Feature, Map } from "ol";
import type Draw from "ol/interaction/Draw";
import type TileLayer from "ol/layer/Tile";
import type { ImageArcGISRest, OSM, TileWMS, XYZ } from "ol/source";
import { JsonObject, JsonProperty, JsonSerializer, throwError } from "typescript-json-serializer";
import type { GeoJSONFeature } from "ol/format/GeoJSON";
import type ImageLayer from "ol/layer/Image";
import { Vector as VectorLayer } from "ol/layer";
import { GeoJsonProperties } from "geojson";
import type { Geometry } from "ol/geom";

export interface LongLat {
  long: number;
  lat: number;
}

export interface ISavedPolygon {
  id: string;
  points: LongLat[];
  dimensions: String[];
  area: string;
  name?: string;
}

@JsonObject()
export class SavedPolygon implements ISavedPolygon {
  constructor({ id, points, dimensions, area }: { id: string; points: LongLat[]; dimensions: String[]; area: string }) {
    this.id = id;
    this.points = points;
    this.dimensions = dimensions;
    this.area = area;
  }
  @JsonProperty()
  id: string = "";

  @JsonProperty()
  points: LongLat[] = [];

  @JsonProperty()
  dimensions: String[] = [];

  @JsonProperty()
  area: string = "";
}

export const defaultSerializer = new JsonSerializer({
  // Throw errors instead of logging
  errorCallback: throwError,

  // Allow all nullish values
  nullishPolicy: {
    undefined: "allow",
    null: "allow",
  },
});
/*
defaultSerializer.deserialize(blob, JointEstate)

    const reserializedModel = JSON.stringify(
      defaultSerializer.serialize(dataModel)
    );
*/
export interface IProject {
  drawLayerFeatures: GeoJSONFeature[];
  stepbackLayerFeatures: GeoJSONFeature[];
  buildingLibrary: ISavedPolygon[];
}
@JsonObject()
export class Project implements IProject {
  constructor(stepbackLayerFeatures: GeoJSONFeature[], drawLayerFeatures: GeoJSONFeature[], buildingLibrary: SavedPolygon[]) {
    this.stepbackLayerFeatures = stepbackLayerFeatures;
    this.drawLayerFeatures = drawLayerFeatures;
    this.buildingLibrary = buildingLibrary;
  }
  @JsonProperty({})
  stepbackLayerFeatures: GeoJSONFeature[] = [];

  @JsonProperty({
    /* TODO, probably */
  })
  drawLayerFeatures: GeoJSONFeature[] = [];

  @JsonProperty({ type: SavedPolygon })
  buildingLibrary: SavedPolygon[] = [];
}

export interface MapContextType {
  map?: Map;
  setMap: React.Dispatch<React.SetStateAction<Map | undefined>>;
  setTopoLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setParcelLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setTonerLayer: React.Dispatch<React.SetStateAction<TileLayer<XYZ> | undefined>>;
  setStreetLayer: React.Dispatch<React.SetStateAction<TileLayer<OSM> | undefined>>;
  setWetlandsLayer: React.Dispatch<React.SetStateAction<TileLayer<TileWMS> | undefined>>;
  setContourLayer: React.Dispatch<React.SetStateAction<ImageLayer<ImageArcGISRest> | undefined>>;
  setSlopeLayer: React.Dispatch<React.SetStateAction<ImageLayer<ImageArcGISRest> | undefined>>;
  setParkingLots: React.Dispatch<React.SetStateAction<Feature<Geometry>[]>>;
  buildingTool?: Draw;
  setBuildingTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  roadTool?: Draw;
  setRoadTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  parkingTool?: Draw;
  setParkingTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  stepbackTool?: Draw;
  setStepbackTool: React.Dispatch<React.SetStateAction<Draw | undefined>>;
  topoLayer?: TileLayer<XYZ>;
  parcelLayer?: TileLayer<XYZ>;
  streetLayer?: TileLayer<OSM>;
  tonerLayer?: TileLayer<XYZ>;
  wetlandsLayer?: TileLayer<TileWMS>;
  contourLayer?: ImageLayer<ImageArcGISRest>;
  slopeLayer?: ImageLayer<ImageArcGISRest>;
  buildingLibrary?: ISavedPolygon[];
  parkingLots?: Feature<Geometry>[];
  setBuildingLibrary?: React.Dispatch<React.SetStateAction<ISavedPolygon[]>>;
  saveProject: () => void;
  loadProject?: (map: Map) => void;
}
export const MapContext = React.createContext<MapContextType>({
  setMap: () => {},
  setTopoLayer: () => {},
  setParcelLayer: () => {},
  setTonerLayer: () => {},
  setStreetLayer: () => {},
  setWetlandsLayer: () => {},
  setContourLayer: () => {},
  setSlopeLayer: () => {},
  setParkingLots: () => {},
  setBuildingTool: () => {},
  setParkingTool: () => {},
  setRoadTool: () => {},
  setStepbackTool: () => {},
  saveProject: () => {},
});
