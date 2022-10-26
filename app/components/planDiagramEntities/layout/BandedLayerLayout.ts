import * as go from "gojs";

export default class BandedLayerLayout extends go.LayeredDigraphLayout {
  doLayout(coll: go.Diagram | go.Group | go.Iterable<go.Part>) {
    super.doLayout(coll);
    /*
    if (coll instanceof go.Diagram) {
      const diagram: go.Diagram = coll;
      diagram.model.commit(function (m: go.Model) {
        diagram.nodes.each((n) => n.moveTo(n.location.x + 1, n.location.y));
      }, "");
    }
    */
  }
  assignLayers(): void {
    super.assignLayers();

    const maxLayer = this.network?.vertexes
      .toArray()
      .filter((element) => element.node?.data.key !== "JointEstate")
      .filter((element) => Object.keys(element).includes("layer"))
      // @ts-ignore
      .map<number>((element) => element.layer)
      .reduce((prev, current) => Math.max(prev, current), 0);
    const maybeRoot = this.network?.vertexes
      .filter((e) => e.node?.data.key === "JointEstate")
      .first();

    // @ts-ignore [2339]
    if (maybeRoot && "layer" in maybeRoot && maybeRoot.layer === maxLayer) {
      // @ts-ignore [2339]
      maybeRoot.layer += 1;
    }
  }

  commitLayers(layerRects: go.Rect[], offset: go.Point): void {
    // update the background object holding the visual "bands"
    var bands = this?.diagram?.findPartForKey("_BANDS");
    if (bands) {
      var model = this?.diagram?.model;
      bands.location = this.arrangementOrigin.copy().add(offset);

      // make each band visible or not, depending on whether there is a layer for it
      for (var it = bands.elements; it.next(); ) {
        var idx = it.key;
        var elt = it.value; // the item panel representing a band
        elt.visible = idx < layerRects.length;
      }

      // set the bounds of each band via data binding of the "bounds" property
      var arr = bands.data.itemArray;
      for (var i = 0; i < layerRects.length; i++) {
        var itemdata = arr[i];
        if (itemdata && model) {
          model.setDataProperty(itemdata, "bounds", layerRects[i]);
        }
      }
    }
  }
}
