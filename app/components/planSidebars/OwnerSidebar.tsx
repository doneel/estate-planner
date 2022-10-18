import OwnerForm from "../planForms/OwnerForm";

export type Owner = {
  category: "Owner";
  name: string;
  birthYear: number;
  netWorth: number;
  expectedLifeSpan: number;
};

export type Props = {
  owner: Partial<Owner>;
  setOwner: (owner: Partial<Owner>) => void;
};

export default function OwnerSidebar({ owner, setOwner }: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Owner</h1>
      <OwnerForm owner={owner} setOwner={setOwner} />
    </div>
  );
}
