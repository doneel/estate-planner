import type { JointEstate } from "../dataModels/Node";
import type { JointEstateUpdateProps } from "../planForms/JointEstateForm";
import JointEstateForm from "../planForms/JointEstateForm";

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
      <h1 className="mx-auto text-2xl">Owner</h1>
      <JointEstateForm
        jointEstate={jointEstate}
        setJointEstate={setJointEstate}
      />
    </div>
  );
}
