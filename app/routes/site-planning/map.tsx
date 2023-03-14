import BrowserOnly from "~/components/BrowserOnly";

export default function DefaultMap() {
  return (
    <BrowserOnly importElementFn={() => import("~/components/maps/EditingLayout")} />
  );
  /*
  return (
    <div>
      <Map center={center} zoom={zoom}>
        <div>
          <TileLayer source={new OSM()} zIndex={0}></TileLayer>
        </div>
      </Map>
    </div>
  );
  */
}
