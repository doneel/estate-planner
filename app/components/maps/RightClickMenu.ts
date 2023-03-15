import type { Feature, Map } from "ol";
import ContextMenu from "ol-contextmenu";
import type { SingleItem, Item, CallbackObject } from "ol-contextmenu/dist/types";
import type VectorSource from "ol/source/Vector";

export function defaultRightClickMenu(newMap: Map, drawLayerSource: VectorSource) {
  function elastic(t: number) {
    return 2 ** (-10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1;
  }

  function center(obj: any) {
    newMap.getView().animate({
      duration: 700,
      easing: elastic,
      center: obj.coordinate,
    });
  }
  const defaultMenu: Item[] = [
    {
      text: "Center map here",
      classname: "bold", // add some CSS rules
      callback: center, // `center` is your callback function
    },
  ];

  interface RemovalPayload {
    feature: Feature;
  }
  const rightClickMenu = new ContextMenu({
    width: 140,
    defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out
    items: defaultMenu,
  });
  const removeMarker = function (obj: CallbackObject) {
    drawLayerSource.removeFeature((obj.data as RemovalPayload).feature);
  };

  const removeMarkerItem: SingleItem = {
    text: " Remove",
    icon: "/images/trash.svg",
    callback: removeMarker,
  };

  const editDimensions: SingleItem = {
    text: "Edit dimensions",
    callback: () => {},
    icon: "/images/pencil-square.svg",
  };

  let restore = false;
  rightClickMenu.on("open", function (evt) {
    const feature = newMap.forEachFeatureAtPixel(evt.pixel, function (ft, l) {
      return ft;
    });
    if (feature) {
      rightClickMenu.clear();
      removeMarkerItem.data = { feature: feature };
      rightClickMenu.push(editDimensions);
      rightClickMenu.push(removeMarkerItem);
      restore = true;
    } else if (restore) {
      rightClickMenu.clear();
      rightClickMenu.extend(defaultMenu);
      restore = false;
    }
  });

  return rightClickMenu;
}
