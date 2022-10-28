import type { Transfer } from "../dataModels/Link";
import TransferForm from "../planForms/TransferForm";

export type Props = {
  transfer: Partial<Transfer>;
  setTransfer: (transfer: Partial<Transfer>) => void;
};

export default function TransferSidebar({ transfer, setTransfer }: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Gift</h1>
      <TransferForm transfer={transfer} setTransfer={setTransfer} />
    </div>
  );
}
