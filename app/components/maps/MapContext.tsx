import React from "react";
import type { Map } from "ol";
import type Draw from "ol/interaction/Draw";
import type TileLayer from "ol/layer/Tile";
import type { OSM, TileWMS, XYZ } from "ol/source";

export interface LongLat {
  long: number;
  lat: number;
}

export interface SavedPolygon {
  id: string;
  points: LongLat[];
  dimensions: String[];
  area: string;
}
export interface MapContextType {
  map?: Map;
  buildingTool?: Draw;
  roadTool?: Draw;
  parkingTool?: Draw;
  stepbackTool?: Draw;
  topoLayer?: TileLayer<XYZ>;
  parcelLayer?: TileLayer<XYZ>;
  streetLayer?: TileLayer<OSM>;
  tonerLayer?: TileLayer<XYZ>;
  wetlandsLayer?: TileLayer<TileWMS>;
  project: {
    featuresGeoJson: JSON;
    buildingLibrary: SavedPolygon[];
    setBuildingLibrary: React.Dispatch<React.SetStateAction<SavedPolygon[]>>;
  };
}
export const MapContext = React.createContext<MapContextType>({ project: { featuresGeoJson: JSON.parse("{}"), buildingLibrary: [], setBuildingLibrary: () => {} } });
