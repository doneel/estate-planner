import type { OnDeath } from "../dataModels/Link";
import OnDeathForm from "../planForms/OnDeathForm";

export type Props = {
  onDeath: Partial<OnDeath>;
  setOnDeath: (onDeath: Partial<OnDeath>) => void;
};

export default function OnDeathSidebar({ onDeath, setOnDeath }: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Transfer</h1>
      <OnDeathForm onDeath={onDeath} setOnDeath={setOnDeath} />
    </div>
  );
}
