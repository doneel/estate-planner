import React from "react";
import type { Map } from "ol";
import type Draw from "ol/interaction/Draw";
import type VectorSource from "ol/source/Vector";
import type Geometry from "ol/geom/Geometry";
import type TileLayer from "ol/layer/Tile";
import type { XYZ } from "ol/source";

export interface MapContextType {
  map?: Map;
  buildingTool?: Draw;
  roadTool?: Draw;
  topoLayer?: TileLayer<XYZ>;
}
export const MapContext = React.createContext<MapContextType>({});
