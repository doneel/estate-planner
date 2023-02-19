import React from "react";
import type { Map } from "ol";

export interface MapContextType {
  map?: Map;
}
export const MapContext = React.createContext<MapContextType>({});
