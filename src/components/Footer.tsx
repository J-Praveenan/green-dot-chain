import Image from "next/image";
import { FileCheck, ShieldCheck, Leaf } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/images/tata-ipl.png"
              alt="TATA IPL"
              width={90}
              height={50}
              className="object-contain"
            />

            <div>
              <h2 className="text-xl font-bold">{APP_NAME}</h2>
              <p className="text-sm text-green-100">
                Blockchain Sustainability Verification Platform
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-6 text-green-100">
            GreenDot Chain is a blockchain-powered platform designed to
            issue and verify IPL sustainability proof records using
            Cardano blockchain technology, IPFS decentralized storage,
            and SHA256 cryptographic verification.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-green-200">Platform</h3>

          <ul className="space-y-2 text-sm text-green-100">
            <li>Issue Sustainability Proofs</li>
            <li>Blockchain Proof Registry</li>
            <li>Public Proof Verification</li>
            <li>Public Proof Verification</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-green-200">Verification</h3>

          <div className="space-y-3 text-sm text-green-100">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              SHA256 Image Verification
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Immutable Blockchain Records
            </div>

            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              IPL Green Campaign Support
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-green-700 px-6 py-5 text-center text-sm text-green-100">
        © 2026 GreenDot Chain. Powered by Cardano blockchain technology for trusted sustainability verification.
      </div>
    </footer>
  );
}