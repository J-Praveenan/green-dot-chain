import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { FileCheck, PlusCircle, ShieldCheck } from "lucide-react";
import IssueProofModal from "./IssueProofModal";

export default function IssueProofSection() {
  const { connected, wallet } = useWallet();

  const [walletAddress, setWalletAddress] = useState("");
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200">
            Issue Tree Proof
          </span>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
                Create a Verified Tree Plantation Proof
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                Admin can add IPL match details, upload planted tree image
                proof, generate the image hash, and create a verification
                record for future Cardano blockchain proof.
              </p>

              {!connected && (
                <div className="mt-8 rounded-3xl border border-yellow-200 bg-yellow-50 p-6">
                  <h3 className="text-xl font-bold text-yellow-800">
                    Wallet Required
                  </h3>
                  <p className="mt-2 text-yellow-700">
                    Please connect your Cardano wallet to issue proof records.
                  </p>
                </div>
              )}

              {connected && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-green-700 px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-green-800"
                >
                  <PlusCircle className="h-5 w-5" />
                  Open Issue Proof Form
                </button>
              )}
            </div>

            <div className="rounded-[2rem] border border-green-100 bg-green-50 p-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-700 text-white">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-gray-950">
                Verification Output
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <FileCheck className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    SHA256 hash of uploaded planted tree image
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    IPL match and plantation metadata record
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    Simulated Cardano transaction hash for current phase
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    Registry record for public image verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <IssueProofModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </section>
  );
}