import type { Trust } from "../dataModels/Node";
import TrustForm from "../planForms/TrustForm";

export type Props = {
  trust: Partial<Trust>;
  setTrust: (trust: Partial<Trust>) => void;
};

export default function TrustSidebar({ trust, setTrust }: Props) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="mx-auto text-2xl">Trust</h1>
      <TrustForm trust={trust} setTrust={setTrust} />
    </div>
  );
}
