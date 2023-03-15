import { useContext } from "react";
import { MapContext } from "~/components/maps/MapContext";

export default function Stepbacks() {
  const { map, stepbackTool } = useContext(MapContext);

  return (
    <div className="align-start flex h-full w-full flex-col">
      <h3 className="my-4 text-center text-2xl font-medium text-gray-700">Setbacks</h3>

      <div className="m-2">
        <button
          className="flex h-16 w-full rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            stepbackTool?.setActive(true);
          }}
        >
          <div className={"flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-blue-200 text-sm font-medium text-white"}>{"new"}</div>
          <div className="flex h-full flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
            <div className="flex h-full flex-1 flex-col truncate px-4 py-2 text-sm">
              <span className="align-center my-auto font-medium text-gray-900 hover:text-gray-600">Add setback</span>
            </div>
            <div className="flex-shrink-0 pr-2"></div>
          </div>
        </button>
        <div className="mt-8">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Setback distance
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm"></span>
            </div>
            <input
              type="text"
              name="roadWidth"
              id="roadWidth"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="10"
              aria-describedby="roadWidthUnit"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="roadWidthUnit">
                meters
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <button
          type="button"
          className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          onClick={() => {
            stepbackTool?.setActive(true);
          }}
        >
          New setback
        </button>
      </div>
    </div>
  );
}
