export type Props = {
  id: string;
  svgPath: string;
  tooltipText: string;
  onClick: () => void;
};

export default function DiagramControlButton({
  id,
  svgPath,
  tooltipText,
  onClick,
}: Props) {
  return (
    <>
      <button
        type="button"
        data-tooltip-target={id}
        data-tooltip-placement="right"
        className="m-1 h-10 w-10 rounded-lg bg-white p-2 hover:bg-slate-200"
        onClick={onClick}
      >
        <img src={svgPath} alt={tooltipText}></img>
      </button>
      <div
        id={id}
        role="tooltip"
        className="tooltip invisible absolute z-20 inline-block min-w-max rounded-lg bg-white py-2 px-3 text-sm font-medium text-gray-900 opacity-0 shadow-sm dark:bg-gray-700"
      >
        {tooltipText}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </>
  );
}
