import type { Map } from "ol";
import { Feature } from "ol";
import type { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import PointerInteraction from "ol/interaction/Pointer";
import type VectorLayer from "ol/layer/Vector";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import type VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import type { SavedPolygon } from "./MapContext";

export class DropBuilding extends PointerInteraction {
  polygon: SavedPolygon;

  constructor(polygon: SavedPolygon) {
    super({});
    this.polygon = polygon;
  }
  handleDownEvent(event: MapBrowserEvent<MouseEvent>) {
    document.querySelector("#full-page-edit-layout")?.classList.remove("drag-building");
    const map: Map = event.map;
    const maybeDrawLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("type") === "draw");
    console.log("Maybe draw layer", maybeDrawLayer);
    const clickX = event.coordinate[0];
    const clickY = event.coordinate[1];

    const drawSource = (maybeDrawLayer as VectorLayer<VectorSource>).getSource();
    const coords: Coordinate[] = this.polygon.points.map((point) => [point.long + clickX, point.lat + clickY] as Coordinate);

    const polygonGeometry = new Polygon([coords]);
    console.log("addable polygon", polygonGeometry, "event click", event.coordinate, "source", drawSource);
    const feature = new Feature(polygonGeometry);
    feature.set("type", "building");
    drawSource?.addFeature(feature);

    map.removeInteraction(this);
    console.log("all features", drawSource?.getFeatures());
    return true;
  }
}
