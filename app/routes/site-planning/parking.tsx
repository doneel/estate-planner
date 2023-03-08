import { useContext } from "react";
import * as turf from "@turf/turf";
import { MapContext } from "~/components/maps/MapContext";
import type VectorSource from "ol/source/Vector";
import type { Geometry, Polygon } from "ol/geom";
import GeoJSON from "ol/format/GeoJSON";
import type { Feature as GJFeature, GeoJsonProperties, Polygon as GJPolygon } from "geojson";
import type { Units } from "@turf/turf";
import { point } from "@turf/turf";
import { formatArea, formatAreaFt, getAreaFt, getRectDimensions } from "~/components/maps/interactiveMapStyles";
import type { Feature } from "ol";

function CalculateAccessible(spaces: number): number {
  var numSpots = spaces;
  let rtn = 0;

  switch (true) {
    case isNaN(numSpots):
      break;
    case numSpots <= 0:
      rtn = 0;
      break;
    case numSpots <= 25:
      rtn = 1;
      break;
    case numSpots <= 50:
      rtn = 2;
      break;
    case numSpots <= 75:
      rtn = 3;
      break;
    case numSpots <= 100:
      rtn = 4;
      break;
    case numSpots <= 150:
      rtn = 5;
      break;
    case numSpots <= 200:
      rtn = 6;
      break;
    case numSpots <= 300:
      rtn = 7;
      break;
    case numSpots <= 400:
      rtn = 8;
      break;
    case numSpots <= 500:
      rtn = 9;
      break;
    case numSpots <= 1000:
      rtn = Math.ceil(numSpots * 0.02);
      break;
    default:
      rtn = Math.ceil(20 + (numSpots - 1000) / 100);
      break;
  }

  return rtn;
}
function calculateParkingSpots(length: number, width: number): ParkingCalcResults {
  if (length === 0 || width === 0) {
    return {
      rows30: 0,
      spaces30: 0,
      accessibleSpaces30: 0,
      vanAccessibleSpaces30: 0,

      rows45: 0,
      spaces45: 0,
      accessibleSpaces45: 0,
      vanAccessibleSpaces45: 0,

      rows60: 0,
      spaces60: 0,
      accessibleSpaces60: 0,
      vanAccessibleSpaces60: 0,

      rows75: 0,
      spaces75: 0,
      accessibleSpaces75: 0,
      vanAccessibleSpaces75: 0,

      rows90: 0,
      spaces90: 0,
      accessibleSpaces90: 0,
      vanAccessibleSpaces90: 0,
    };
  }
  var tmp2L = length;
  var tmp2W = width;
  var H = 0;
  var W = 0;

  if (tmp2L < tmp2W) {
    H = tmp2W;
    W = tmp2L;
  } else {
    H = tmp2L;
    W = tmp2W;
  }

  var MCINT30 = 41.7;
  var MINT30 = 37.8;
  var DINT30 = 12.9;
  var WP30 = 18.0;

  var MCINT45 = 48.0;
  var MINT45 = 44.8;
  var DINT45 = 15.9;
  var WP45 = 12.7;

  var MCINT60 = 53.9;
  var MINT60 = 51.7;
  var DINT60 = 17.8;
  var WP60 = 10.4;

  var MCINT75 = 58.3;
  var MINT75 = 57.1;
  var DINT75 = 18.6;
  var WP75 = 9.3;

  var MCINT90 = 60.0;
  var MINT90 = 60.0;
  var DINT90 = 0;
  var WP90 = 0;
  var StallWidth = 9.0;

  var Rows30 = Math.floor((W - 2 * MCINT30) / MINT30 + 2);
  var Angle30Degrees = 30 * (180 / Math.PI);
  var Spaces30 = Math.floor(2 * ((H - DINT30 / Math.tan(Angle30Degrees)) / WP30) * Rows30 * 0.85);
  var AccessibleSpaces30 = CalculateAccessible(Spaces30);
  var VanAccessibleSpaces30 = Math.ceil(AccessibleSpaces30 / 6);

  var Rows45 = Math.floor((W - 2 * MCINT45) / MINT45 + 2);
  var Angle45Degrees = 45 * (180 / Math.PI);
  var Spaces45 = Math.floor(2 * ((H - DINT45 / Math.tan(Angle45Degrees)) / WP45) * Rows45 * 0.85);
  var AccessibleSpaces45 = CalculateAccessible(Spaces45);
  var VanAccessibleSpaces45 = Math.ceil(AccessibleSpaces45 / 6);

  var Rows60 = Math.floor((W - 2 * MCINT60) / MINT60 + 2);
  var Angle60Degrees = 60 * (180 / Math.PI);
  var Spaces60 = Math.floor(2 * ((H - DINT60 / Math.tan(Angle60Degrees)) / WP60) * Rows60 * 0.85);
  var AccessibleSpaces60 = CalculateAccessible(Spaces60);
  var VanAccessibleSpaces60 = Math.ceil(AccessibleSpaces60 / 6);

  var Rows75 = Math.floor((W - 2 * MCINT75) / MINT75 + 2);
  var Angle75Degrees = 75 * (180 / Math.PI);
  var Spaces75 = Math.floor(2 * ((H - DINT75 / Math.tan(Angle75Degrees)) / WP75) * Rows75 * 0.85);
  var AccessibleSpaces75 = CalculateAccessible(Spaces75);
  var VanAccessibleSpaces75 = Math.ceil(AccessibleSpaces75 / 6);

  var Rows90 = Math.floor((W - 2 * MCINT90) / MINT90 + 2);
  var Spaces90 = Math.floor(((2 * H) / StallWidth) * Rows90 * 0.85);
  var AccessibleSpaces90 = CalculateAccessible(Spaces90);
  var VanAccessibleSpaces90 = Math.ceil(AccessibleSpaces90 / 6);

  return {
    rows30: Rows30,
    spaces30: Spaces30,
    accessibleSpaces30: AccessibleSpaces30,
    vanAccessibleSpaces30: VanAccessibleSpaces30,

    rows45: Rows45,
    spaces45: Spaces45,
    accessibleSpaces45: AccessibleSpaces45,
    vanAccessibleSpaces45: VanAccessibleSpaces45,

    rows60: Rows60,
    spaces60: Spaces60,
    accessibleSpaces60: AccessibleSpaces60,
    vanAccessibleSpaces60: VanAccessibleSpaces60,

    rows75: Rows75,
    spaces75: Spaces75,
    accessibleSpaces75: AccessibleSpaces75,
    vanAccessibleSpaces75: VanAccessibleSpaces75,

    rows90: Rows90,
    spaces90: Spaces90,
    accessibleSpaces90: AccessibleSpaces90,
    vanAccessibleSpaces90: VanAccessibleSpaces90,
  };
}

interface ParkingCalcResults {
  rows30: number;
  spaces30: number;
  accessibleSpaces30: number;
  vanAccessibleSpaces30: number;

  rows45: number;
  spaces45: number;
  accessibleSpaces45: number;
  vanAccessibleSpaces45: number;

  rows60: number;
  spaces60: number;
  accessibleSpaces60: number;
  vanAccessibleSpaces60: number;

  rows75: number;
  spaces75: number;
  accessibleSpaces75: number;
  vanAccessibleSpaces75: number;

  rows90: number;
  spaces90: number;
  accessibleSpaces90: number;
  vanAccessibleSpaces90: number;
}

function runByFeatures(features: GJFeature<GJPolygon, GeoJsonProperties>) {
  if (features.type !== "Feature") return undefined;
  const polygon = turf.polygon(features.geometry.coordinates);

  const unitsOption: { units: Units } = { units: "kilometers" };
  let bbox, percentage1, percentage2, fraction, point1, point2, bearing;
  let point1a, point1b, point2a, point2b, line1, line2;
  let largest, diagonalLength;

  const polyline: turf.LineString = turf.polygonToLineString(polygon);
  const length = turf.length(polyline, unitsOption);
  bbox = turf.bbox(polygon);
  diagonalLength = turf.length(
    turf.lineString([
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ])
  );

  const SEARCH_PARTS = 100;
  for (let i = 0; i < SEARCH_PARTS; i++) {
    percentage1 = i / SEARCH_PARTS;
    point1 = turf.along(polyline, percentage1 * length, unitsOption);

    for (let j = 1; j < SEARCH_PARTS; j++) {
      fraction = j / SEARCH_PARTS;
      percentage2 = percentage1 + fraction;

      if (percentage2 > 1) {
        percentage2 -= 1;
      }

      let distance = percentage2 * length;
      point2 = turf.along(polyline, distance, unitsOption);

      //process as side
      //get bearing between points
      bearing = turf.bearing(point1, point2);

      //create perpendicual lines at start and end
      point1a = turf.destination(point1, diagonalLength, bearing + 90, unitsOption);
      point1b = turf.destination(point1, diagonalLength, bearing - 90, unitsOption);
      line1 = turf.lineString([turf.getCoord(point1a), turf.getCoord(point1b)]);

      point2a = turf.destination(point2, diagonalLength, bearing + 90, unitsOption);
      point2b = turf.destination(point2, diagonalLength, bearing - 90, unitsOption);
      line2 = turf.lineString([turf.getCoord(point2a), turf.getCoord(point2b)]);

      //intersect by polygon (assume single parts)
      let intersect1 = turf.lineIntersect(line1, polygon);
      let intersect2 = turf.lineIntersect(line2, polygon);

      const intersectObjArray = [];
      turf
        .coordAll(intersect1)
        .filter((coord) => {
          return turf.distance(point1, turf.point(coord), unitsOption) > 0.001;
        })
        .forEach((coord) => {
          intersectObjArray.push({
            coord: coord,
            origin: turf.getCoord(point1),
            opp: turf.getCoord(point2),
            oppLine: line2,
            p: point1,
            op: point2,
          });
        });

      turf
        .coordAll(intersect2)
        .filter((coord) => {
          return turf.distance(point2, turf.point(coord), unitsOption) > 0.001;
        })
        .forEach((coord) => {
          intersectObjArray.push({
            coord: coord,
            origin: turf.getCoord(point2),
            opp: turf.getCoord(point1),
            oppLine: line1,
            p: point2,
            op: point1,
          });
        });

      if (intersectObjArray.length === 0) continue;

      intersectObjArray.forEach((obj, k) => {
        const { origin, coord, opp, oppLine, p, op } = obj;
        let dest = turf.destination(turf.point(coord), turf.distance(p, op, unitsOption), turf.bearing(p, op), unitsOption);

        //form rectangle and add to dest
        let coords = [origin, opp, turf.getCoord(dest), coord, origin];

        let rectangle = turf.polygon([[...coords]]);

        //all 4 coordinates must be within the polygon
        //what has been sliced by polygon should be empty
        if (!turf.booleanContains(polygon, rectangle) || turf.flatten(turf.difference(rectangle, polygon) || turf.featureCollection([])).features.length > 0) {
          return;
        }

        if (largest === undefined || turf.area(rectangle) > turf.area(largest)) {
          largest = rectangle;
        }
      });
    }
  }

  return largest;
}

const format = new GeoJSON();
export function getUsableParkingLot(drawnSpace: Feature<Geometry>): Feature<Geometry> {
  const clone = drawnSpace.clone();
  clone.getGeometry()?.transform("EPSG:3857", "EPSG:4326");
  const terfRectangle = runByFeatures(format.writeFeatureObject(clone) as GJFeature<GJPolygon, GeoJsonProperties>);
  const rawOlRectangle = format.readFeature(terfRectangle);
  rawOlRectangle?.getGeometry()?.transform("EPSG:4326", "EPSG:3857");
  rawOlRectangle.set("type", "parking-internal-rect");
  return rawOlRectangle;
}

export default function Parking() {
  const { map, parkingTool, parkingLots } = useContext(MapContext);

  const buildings = map
    ?.getAllLayers()
    .filter((l) => l.get("type") === "draw")
    .flatMap((l) => (l.getSource() as VectorSource<Geometry>).getFeatures())
    .filter((f) => f.get("type") === "building");
  const buildingSqFt = buildings
    ?.map((f) => f.getGeometry() as Polygon)
    .map((p) => getAreaFt(p))
    .reduce((prev, current) => prev + current, 0);

  const usableParkingLots =
    map
      ?.getAllLayers()
      .filter((l) => l.get("type") === "draw")
      .flatMap((l) => (l.getSource() as VectorSource<Geometry>).getFeatures())
      .filter((f) => f.get("type") === "parking-internal-rect") ?? [];

  const parkingResults = usableParkingLots.map((rect) => getRectDimensions(rect.getGeometry() as Polygon)).map(([width, length]) => calculateParkingSpots(width, length));

  const maxParkingSpacesPossible = parkingResults
    .map((result) => Math.max(result.spaces30, result.spaces45, result.spaces60, result.spaces75, result.spaces90))
    .reduce((prev, current) => prev + current, 0);
  const accessibleRequired = parkingResults
    .map((result) => Math.max(result.accessibleSpaces30, result.accessibleSpaces45, result.accessibleSpaces60, result.accessibleSpaces75, result.accessibleSpaces90))
    .reduce((prev, current) => prev + current, 0);
  //const [width, length] = largest !== undefined ? getRectDimensions(largest.getGeometry() as Polygon) : [0, 0];

  return (
    <div className="align-start flex h-full w-full flex-col space-y-8">
      <h3 className="my-4 text-center text-2xl font-medium text-gray-700">Parking</h3>

      <div className="m-2">
        <button
          className="flex h-16 w-full rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            parkingTool?.setActive(true);
          }}
        >
          <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-blue-200 text-sm font-medium text-white"}>{"new"}</div>
          <div className="flex h-full flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
            <div className="flex h-full flex-1 flex-col truncate px-4 py-2 text-sm">
              <span className="align-center my-auto font-medium text-gray-900 hover:text-gray-600">New parking lot</span>
            </div>
            <div className="flex-shrink-0 pr-2"></div>
          </div>
        </button>
      </div>

      <div className="mx-2 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Summary</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Configure parking requirements to automate layout</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of spaces</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{maxParkingSpacesPossible}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Parking sq footage</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{formatAreaFt(usableParkingLots.map((r) => getAreaFt(r.getGeometry() as Polygon)).reduce((p, n) => p + n, 0))}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Parking ratio</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{buildingSqFt && maxParkingSpacesPossible ? maxParkingSpacesPossible / (buildingSqFt / 1000) : "N/A"}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Required handicapped spaces</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{accessibleRequired}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
