import BeneficiaryForm from "../planForms/BeneficiaryForm";

export type Beneficiary = {
  category: "Beneficiary";
  name: string;
  birthYear: number;
};

export type Props = {
  beneficiary: Partial<Beneficiary>;
  setBeneficiary: (beneficiary: Partial<Beneficiary>) => void;
};

export default function BeneficiarySidebar({
  beneficiary,
  setBeneficiary,
}: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Beneficiary</h1>
      <BeneficiaryForm
        beneficiary={beneficiary}
        setBeneficiary={setBeneficiary}
      />
    </div>
  );
}
