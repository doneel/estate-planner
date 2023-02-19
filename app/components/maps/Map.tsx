import type { PropsWithChildren } from "react";
import React from "react";
import { fromLonLat } from "ol/proj";
import type { Geometry } from "ol/geom";
import { Point } from "ol/geom";
import "ol/ol.css";

import type {
  MapBrowserEvent, RFeatureUIEvent} from "rlayers";
import {
  RMap,
  ROSM,
  RLayerVector,
  RFeature,
  ROverlay,
  RStyle,
  RControl,
  RInteraction
} from "rlayers";
import locationIcon from "../../../public/images/gift.svg";
import { GifIcon } from "@heroicons/react/24/outline";
import type VectorSource from "ol/source/Vector";

import "./styles.css";
import {
  shiftKeyOnly,
  altShiftKeysOnly,
  altKeyOnly,
  never,
  platformModifierKeyOnly,
  doubleClick,
} from "ol/events/condition";
import type BaseEvent from "ol/events/Event";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
export interface Props {
  //zoom: number;
  //center: number[];
  selectedTool: string;
}

const TourEiffel = fromLonLat([2.294, 48.858]);
const TourEiffelPoint = new Point(TourEiffel);
export default function Map({selectedTool}: Props) {
  const mapRef = React.createRef() as React.RefObject<RMap>;
  const drawLayer = React.createRef() as React.RefObject<RLayerVector>;

  const [drawTool, setDrawTool] = React.useState<Draw | undefined>(undefined);


  React.useEffect(() => {
    console.log(selectedTool, typeof selectedTool)
    if (drawTool !== undefined ) {
        mapRef.current?.ol.removeInteraction(drawTool);
    }
    const newDrawTool = new Draw({source: drawLayer.current?.source, type: selectedTool === 'buildings' ? 'Polygon' : "LineString"});
    setDrawTool(newDrawTool);
    if (drawTool !== undefined ) {
        mapRef.current?.ol.addInteraction(newDrawTool);
    }
   }, [selectedTool])


  /*
  const ActiveTool = selectedTool === "roads" ? (
        <RInteraction.RDraw
          type={"LineString"}
          condition={(e: MapBrowserEvent<UIEvent>) => true }
          freehandCondition={shiftKeyOnly}
        />
  ) : (
        <RInteraction.RDraw
          type={"Polygon"}
          condition={(e: MapBrowserEvent<UIEvent>) => true }
          freehandCondition={shiftKeyOnly}
        />
  );
  */

  return (
    // Create a map, its size is set in the CSS class example-map
    <RMap
      className="example-map h-full w-full"
      initial={{ center: fromLonLat([2.364, 48.82]), zoom: 11 }}
      noDefaultControls={true}
      ref={mapRef}
    >
      {/* Use an OpenStreetMap background */}
      <ROSM />

      <RControl.RScaleLine className="mr-1 bg-red-900" />
      <RControl.RZoom className="m-2 bg-gray-100 h-fit w-fit border-1 border-gray-400" />
      <RControl.RZoomSlider />

      <RLayerVector>
        <RStyle.RStyle>
          <RStyle.RIcon src={locationIcon} />
        </RStyle.RStyle>
        <RFeature geometry={TourEiffelPoint} />
      </RLayerVector>

      <RLayerVector
        ref={drawLayer}
        onChange={React.useCallback((e: BaseEvent) => {
          // On every change, check if there is a feature covering the Eiffel Tower
          const source = e.target as VectorSource<Geometry>;
          if (source?.forEachFeatureAtCoordinateDirect)
            setSelected(
              source.forEachFeatureAtCoordinateDirect(TourEiffel, () => true) ??
                false
            );
        }, [])}
      >
        {/* This is the style used for the drawn polygons */}
        <RStyle.RStyle>
          <RStyle.RStroke color="#0000ff" width={3} />
          <RStyle.RFill color="rgba(0, 0, 0, 0.75)" />
        </RStyle.RStyle>


        { /* <RInteraction.RDraw
          type={"Polygon"}
          condition={() => buildingSelected}
          freehandCondition={altShiftKeysOnly}
        />
       */}

        <RInteraction.RDraw
          type={"Circle"}
          condition={altKeyOnly}
          freehandCondition={never}
        />

        <RInteraction.RModify
          condition={platformModifierKeyOnly}
          deleteCondition={React.useCallback(
            (e: MapBrowserEvent<UIEvent>) => platformModifierKeyOnly(e) && doubleClick(e),
            []
          )}
        />
      </RLayerVector>
    </RMap>
  );
}
