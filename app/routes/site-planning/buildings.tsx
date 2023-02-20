import { useContext } from "react";
import { MapContext } from "~/components/maps/MapContext";

export default function Roads() {
  const { map, buildingTool } = useContext(MapContext);

  return (
    <div className="align-start flex h-full w-full flex-col">
      <h3 className="my-4 text-center text-2xl font-medium text-gray-700">Buildings</h3>
      <div className="w-full">
        <button
          type="button"
          className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          onClick={() => {
            buildingTool?.setActive(true);
          }}
        >
          New Building
        </button>
      </div>
    </div>
  );
}
