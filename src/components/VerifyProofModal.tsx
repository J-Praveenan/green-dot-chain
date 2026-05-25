import { useState } from "react";
import {
  Search,
  ShieldCheck,
  X,
  XCircle,
  Upload,
  Loader2,
} from "lucide-react";

import { generateSHA256 } from "@/lib/hash";
import { verifyProofOnBlockchain } from "@/lib/blockchain";
import {
  showErrorToast,
  showSuccessToast,
 
} from "@/lib/toast";

type VerifyResult = {
  valid: boolean;
  reason?: string;
  blockchainHash?: string;
  uploadedHash?: string;
  metadata?: any;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function VerifyProofModal({ open, onClose }: Props) {
  const [txHash, setTxHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadedHash, setUploadedHash] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const hash = await generateSHA256(file);

    setFileName(file.name);
    setUploadedHash(hash);
    setResult(null);
  };

  const verifyProof = async () => {
    if (!txHash || !uploadedHash) {
      showErrorToast("Please enter the transaction hash and upload the proof image.");
      return;
    }

    try {
      setLoading(true);
      const verifyResult = await verifyProofOnBlockchain(txHash, uploadedHash);
      setResult(verifyResult);
      {
        verifyResult.valid ? showSuccessToast("Proof verified successfully on Cardano.") : showErrorToast("Proof verification failed.");
      }
      
    } catch (error) {
      console.error(error);
      setResult({
        valid: false,
        reason: "Verification failed. Please try again.",
      });
      showErrorToast("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetVerify = () => {
    setTxHash("");
    setFileName("");
    setUploadedHash("");
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-700" />
              <h2 className="text-xl font-bold text-gray-950">
                Verify Tree Plantation Proof
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enter the Cardano transaction hash and upload the tree image to
              verify against blockchain metadata.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!result && (
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Cardano Transaction Hash *
                </label>

                <input
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter transaction hash"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Upload Original Tree Image *
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50 p-4 text-center transition hover:bg-green-100">
                  <Upload className="h-6 w-6 text-green-700" />

                  <p className="mt-3 font-semibold text-gray-900">
                    Click to upload the original proof image
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    The image hash will be compared with the hash stored on Cardano.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
              </div>

              {fileName && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="font-bold text-green-800">
                    Image Hash Generated Successfully
                  </p>

                  <p className="mt-2 text-sm text-green-700">
                    File: {fileName}
                  </p>

                  <p className="mt-3 break-all text-xs leading-6 text-green-900">
                    {uploadedHash}
                  </p>
                </div>
              )}
            </div>
          )}

          {result && result.valid && (
            <div>
              <div className="text-center">
                <ShieldCheck className="mx-auto h-16 w-16 text-green-600" />

                <div className="mt-4 inline-flex rounded-full bg-green-100 px-6 py-3 text-lg font-bold text-green-700">
                  Valid Blockchain Proof
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  The uploaded image matches the proof hash stored in Cardano blockchain metadata.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                <h3 className="mb-4 text-lg font-bold text-green-900">
                  Verified Blockchain Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Proof ID:
                    </p>
                    <p className="break-all text-sm text-green-900">
                      {result.metadata?.proofId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-green-700">Match:</p>
                    <p className="text-sm text-green-900">
                      {result.metadata?.matchName || result.metadata?.match}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Location:
                    </p>
                    <p className="text-sm text-green-900">
                      {result.metadata?.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Verifier:
                    </p>
                    <p className="text-sm text-green-900">
                      {result.metadata?.verifierName ||
                        result.metadata?.verifier}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-green-700">
                    Blockchain Image Hash:
                  </p>

                  <p className="mt-1 break-all text-xs leading-6 text-green-900">
                    {result.blockchainHash}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-green-700">
                    Uploaded Image Hash:
                  </p>

                  <p className="mt-1 break-all text-xs leading-6 text-green-900">
                    {result.uploadedHash}
                  </p>
                </div>
              </div>
            </div>
          )}

          {result && !result.valid && (
            <div>
              <div className="text-center">
                <XCircle className="mx-auto h-16 w-16 text-red-600" />

                <div className="mt-4 inline-flex rounded-full bg-red-100 px-6 py-3 text-lg font-bold text-red-700">
                  Invalid or Unmatched Proof
                </div>

                <p className="mt-4 text-sm leading-6 text-red-700">
                  {result.reason ||
                    "The uploaded image does not match blockchain metadata."}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-bold text-red-700">
                  Uploaded Hash:
                </p>

                <p className="mt-2 break-all text-xs leading-6 text-red-900">
                  {result.uploadedHash || uploadedHash}
                </p>

                {result.blockchainHash && (
                  <>
                    <p className="mt-5 text-sm font-bold text-red-700">
                      Blockchain Hash:
                    </p>

                    <p className="mt-2 break-all text-xs leading-6 text-red-900">
                      {result.blockchainHash}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - always visible inside modal */}
        <div className="shrink-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          {result ? (
            <>
              <button
                onClick={resetVerify}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Verify Another
              </button>

              <button
                onClick={onClose}
                className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={verifyProof}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Verifying Proof..." : "Verify Proof"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}