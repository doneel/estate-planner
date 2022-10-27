import type { JointEstate } from "../dataModels/Node";
import type { JointEstateUpdateProps } from "../planForms/JointEstateForm";
import JointEstateForm from "../planForms/JointEstateForm";
import WashingtonTaxSummaryTab from "./WashingtonTaxSummaryTab";

export type Props = {
  jointEstate: Partial<JointEstate>;
  setJointEstate: (jointEstate: Partial<JointEstateUpdateProps>) => void;
};

export default function JointEstateSidebar({
  jointEstate,
  setJointEstate,
}: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Joint Estate</h1>
      <JointEstateForm
        jointEstate={jointEstate}
        setJointEstate={setJointEstate}
      />
      {jointEstate.washingtonTaxes && (
        <WashingtonTaxSummaryTab taxSummary={jointEstate.washingtonTaxes} />
      )}
    </div>
  );
}
