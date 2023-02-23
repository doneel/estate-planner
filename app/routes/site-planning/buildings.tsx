import { EllipsisVerticalIcon, HomeModernIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { DropBuilding } from "~/components/maps/DropBuildingInteraction";
import { MapContext } from "~/components/maps/MapContext";

export default function Buildings() {
  const { map, buildingTool, buildingLibrary } = useContext(MapContext);

  console.log(buildingLibrary);
  return (
    <div className="align-start flex h-full w-full flex-col">
      <h3 className="my-4 text-center text-2xl font-medium text-gray-700">Buildings</h3>
      <div className="m-2">
        <button
          className="flex h-16 w-full rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            buildingTool?.setActive(true);
          }}
        >
          <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-blue-200 text-sm font-medium text-white"}>{"new"}</div>
          <div className="flex h-full flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
            <div className="flex h-full flex-1 flex-col truncate px-4 py-2 text-sm">
              <span className="align-center my-auto font-medium text-gray-900 hover:text-gray-600">Create new building</span>
            </div>
            <div className="flex-shrink-0 pr-2"></div>
          </div>
        </button>

        <ul role="list" className="mt-3 grid grow grid-cols-1 gap-5 sm:grid-cols-1 sm:gap-6 lg:grid-cols-1">
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
                  <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-gray-200 text-sm font-medium text-white"}>{building.initials}</div>
                  <div className="flex h-16 flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <div className="flex font-medium text-gray-900 hover:text-gray-600">
                        {building.name ?? `Unnamed building (${building.area})`} <PencilSquareIcon className="ml-2 h-4 w-4 self-center hover:text-blue-400" />
                      </div>
                      <p className="text-gray-500">{building.dimensions.join(" x ")} Members</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
    </div>
  );
}
