import React from "react";
import type { Map } from "ol";
import type Draw from "ol/interaction/Draw";
import type TileLayer from "ol/layer/Tile";
import type { OSM, XYZ } from "ol/source";

export interface LongLat {
  long: number;
  lat: number;
}

export interface SavedPolygon {
  id: string;
  points: LongLat[];
  dimensions: String[];
}
export interface MapContextType {
  map?: Map;
  buildingTool?: Draw;
  roadTool?: Draw;
  topoLayer?: TileLayer<XYZ>;
  parcelLayer?: TileLayer<XYZ>;
  streetLayer?: TileLayer<OSM>;
  tonerLayer?: TileLayer<XYZ>;
  project: {
    featuresGeoJson: JSON;
    buildingLibrary: SavedPolygon[];
    setBuildingLibrary: React.Dispatch<React.SetStateAction<SavedPolygon[]>>;
  };
}
export const MapContext = React.createContext<MapContextType>({ project: { featuresGeoJson: JSON.parse("{}"), buildingLibrary: [], setBuildingLibrary: () => {} } });
