import { RadioGroup, Switch } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { MapContext } from "~/components/maps/MapContext";

function classNames(...classes: String[]) {
  return classes.filter(Boolean).join(" ");
}
export default function Layers() {
  const { topoLayer, streetLayer, parcelLayer, tonerLayer, wetlandsLayer, contourLayer, slopeLayer } = useContext(MapContext);
  const baseChoices = [
    { name: "Street", details: "©OSM 2022", olLayer: streetLayer },
    { name: "Topo", details: "Topo & Wetland features Provided by ESGI", olLayer: topoLayer },
    { name: "Toner", details: "B&W canvas by Stamen Design", olLayer: tonerLayer },
  ];

  const [selectedBase, setSelectedBase] = useState(baseChoices[0].name);

  const [parcelEnabled, setParcelEnabled] = useState(parcelLayer?.getVisible());
  const [wetlandsEnabled, setWetlandsEnabled] = useState(wetlandsLayer?.getVisible());
  const [contourEnabled, setContourEnabled] = useState(contourLayer?.getVisible());
  const [slopeEnabled, setSlopeEnabled] = useState(slopeLayer?.getVisible());

  const overlayChoices = [
    { name: "1ft Topo", enabled: contourEnabled, setEnabled: setContourEnabled, layer: contourLayer },
    { name: "Parcel boundaries", enabled: parcelEnabled, setEnabled: setParcelEnabled, layer: parcelLayer },
    { name: "Wetlands", enabled: wetlandsEnabled, setEnabled: setWetlandsEnabled, layer: wetlandsLayer },
    { name: "Slope Steepness", enabled: slopeEnabled, setEnabled: setSlopeEnabled, layer: slopeLayer },
  ];

  return (
    <div className="align-start flex h-full w-full flex-col">
      <h3 className="my-4 text-center text-2xl font-medium text-gray-700">Layers</h3>
      <div className="mx-2">
        <div className="text-md my-4 mx-1 font-medium text-gray-900">Base layers</div>
        <RadioGroup
          value={selectedBase}
          onChange={(value) => {
            setSelectedBase(value);
            baseChoices.filter((base) => base.name === value).forEach((base) => base.olLayer?.setVisible(true));
            baseChoices.filter((base) => base.name !== value).forEach((base) => base.olLayer?.setVisible(false));
          }}
        >
          <RadioGroup.Label className="sr-only"> Server size </RadioGroup.Label>
          <div className="space-y-4">
            {baseChoices.map((base) => (
              <RadioGroup.Option
                key={base.name}
                value={base.name}
                className={({ active, checked }) =>
                  `${active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300" : ""}
                  ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label as="p" className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}>
                            {base.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description as="span" className={`inline ${checked ? "text-sky-100" : "text-gray-500"}`}>
                            <span>{base.details}</span>{" "}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div className="text-md mx-1 mt-8 mb-4 font-medium text-gray-900">Overlays</div>
        <Switch.Group as="div" className="items-left my-4 flex flex-col justify-between space-y-2">
          {overlayChoices.map((overlay) => {
            return (
              <div className="flex" key={overlay.name}>
                <Switch
                  checked={overlay.layer?.getVisible()}
                  onChange={() => {
                    overlay.setEnabled(!overlay.enabled);
                    overlay.layer?.setVisible(!overlay.layer?.getVisible());
                  }}
                  className={classNames(
                    overlay.enabled ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      overlay.enabled ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
                <span className="ml-4 flex flex-grow flex-col">
                  <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                    {overlay.name}
                  </Switch.Label>
                </span>
              </div>
            );
          })}
        </Switch.Group>
      </div>
    </div>
  );
}
