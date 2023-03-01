import { EllipsisVerticalIcon, HomeModernIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import type Polygon from "ol/geom/Polygon";
import type VectorSource from "ol/source/Vector";
import { getArea } from "ol/sphere";
import { useContext } from "react";
import { DropBuilding } from "~/components/maps/DropBuildingInteraction";
import { formatArea, formatAreaFt, getAreaFt } from "~/components/maps/interactiveMapStyles";
import { MapContext } from "~/components/maps/MapContext";

function buildingName(b: Feature) {
  return b.get("name") ?? `Unnamed building (${formatArea(b.getGeometry() as Polygon)})`;
}

function initials(name?: string) {
  return name
    ?.split(" ")
    .map((substr) => substr.charAt(0))
    .filter((value, index) => index <= 3) // limit number of initials
    .join("");
}

export default function Buildings() {
  const { map, buildingTool, buildingLibrary } = useContext(MapContext);

  const buildings = map
    ?.getAllLayers()
    .filter((l) => l.get("type") === "draw")
    .flatMap((l) => (l.getSource() as VectorSource<Geometry>).getFeatures())
    .filter((f) => f.get("type") === "building");

  const buildingsByName: Record<string, Feature[]> = {};
  buildings?.forEach((building) => {
    if (buildingsByName[buildingName(building)]) {
      buildingsByName[buildingName(building)].push(building);
    } else {
      buildingsByName[buildingName(building)] = [building];
    }
  });

  console.log("found buildings", buildings);

  const totalAreaSqFt = buildings
    ?.map((f) => f.getGeometry() as Polygon)
    .map((p) => getAreaFt(p))
    .reduce((prev, current) => prev + current, 0);

  return (
    <div className="align-start flex h-full w-full flex-col space-y-8">
      <h3 className="mt-4 text-center text-2xl font-medium text-gray-700">Buildings</h3>
      <div className="m-2">
        <button
          className="flex h-16 w-full rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            buildingTool?.setActive(true);
          }}
        >
          <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-blue-200 text-sm font-medium text-white"}>{"new"}</div>
          <div className="flex h-full flex-1 items-center justify-between truncate rounded-r-md border-t border-b border-r border-gray-200 bg-white">
            <div className="flex h-full flex-1 flex-col truncate px-4 py-2 text-sm">
              <span className="align-center my-auto font-medium text-gray-900 hover:text-gray-600">Create new building</span>
            </div>
            <div className="flex-shrink-0 pr-2"></div>
          </div>
        </button>

        <ul role="list" className="mt-2 grid grow grid-cols-1 gap-5 sm:grid-cols-1 sm:gap-2 lg:grid-cols-1">
          {buildingLibrary === undefined || (buildingLibrary.length === 0 && <div className="self-center text-center text-lg text-gray-200">No buildings saved yet</div>)}
          {buildingLibrary &&
            buildingLibrary.length > 0 &&
            buildingLibrary.map((building) => (
              <li key={building.id} className="h-fit ">
                <button
                  className="col-span-1 flex h-16 max-w-full rounded-md shadow-sm hover:bg-gray-50"
                  type="button"
                  onClick={(e) => {
                    map?.addInteraction(new DropBuilding(building));
                    document.querySelector("#full-page-edit-layout")?.classList.add("drag-building");
                  }}
                >
                  <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-gray-200 text-sm font-medium text-white"}>{initials(building.name)}</div>
                  <div className="flex h-16 flex-1 items-center justify-between truncate rounded-r-md border-t border-b border-r border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <div className="flex font-medium text-gray-900 hover:text-gray-600">
                        {building.name ?? `Unnamed building (${building.area})`} <PencilSquareIcon className="ml-2 h-4 w-4 self-center hover:text-blue-400" />
                      </div>
                      <p className="text-gray-500">{building.dimensions.join(" x ")} Members</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="mx-2 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Summary</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit building details to add information.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Structures</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{buildings?.length}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total sq footage</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{totalAreaSqFt && formatAreaFt(totalAreaSqFt)}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Parcel coverage</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">
                {
                  <span className="flex space-x-4 text-red-200">
                    <ExclamationTriangleIcon width={24} /> <div>Define parcel boundaries</div>
                  </span>
                }
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Residential occupancy</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:my-auto">{0}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Retail sq ft</dt>
              <dd className="mt-1 text-sm text-gray-900 text-gray-200 sm:col-span-2 sm:my-auto">N/A</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Counts</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                  {Object.entries(buildingsByName).map(([buildingName, buildings]) => {
                    return (
                      <li key={buildingName} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center text-gray-400">{buildingName}</div>
                        <div className="items-right w-0 text-gray-600">{buildings.length}</div>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
