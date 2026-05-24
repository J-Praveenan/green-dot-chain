"use client";

import { useEffect, useState } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  Loader2,
  Download,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "@meshsdk/react";

import { CAMPAIGN } from "@/lib/constants";
import { generateSHA256 } from "@/lib/hash";
import {
  submitProofToBlockchain,
  uploadFileToPinata,
  getCardanoScanTxUrl,
} from "@/lib/blockchain";
import { generateCertificatePDF } from "@/lib/certificate";
import type { TreeProofRecord } from "@/types";
import {
  checkDuplicateImageHash,
  saveProofIndex,
} from "@/lib/proofRegistry";

import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function IssueProofModal({ open, onClose }: Props) {
  const { connected, wallet } = useWallet();

  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageHash, setImageHash] = useState("");

  const [successRecord, setSuccessRecord] =
    useState<TreeProofRecord | null>(null);

  const [form, setForm] = useState({
    matchName: "",
    overNumber: "",
    bowlerName: "",
    location: "",
    plantationDate: "",
    verifierName: "",
  });

  useEffect(() => {
    const loadWallet = async () => {
      if (!connected || !wallet) {
        setWalletAddress("");
        return;
      }

      try {
        const addresses = await wallet.getUsedAddresses();

        if (addresses.length > 0) {
          setWalletAddress(addresses[0]);
        }
      } catch (error) {
        console.error("Failed to load wallet address", error);
      }
    };

    loadWallet();
  }, [connected, wallet]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImageFile(file);
    setImageName(file.name);

    const hash = await generateSHA256(file);

    const duplicate = await checkDuplicateImageHash(hash);

    if (duplicate) {
      showErrorToast(
        "This tree proof image already exists."
      );

      return;
    }
    setImageHash(hash);
  };

  const issueProof = async () => {
    if (!connected || !wallet) {
      showErrorToast("Please connect your Cardano wallet.");
      return;
    }

    if (
      !form.matchName ||
      !form.overNumber ||
      !form.bowlerName ||
      !form.location ||
      !form.plantationDate ||
      !form.verifierName
    ) {
      showErrorToast("Please fill all required fields.");
      return;
    }

    if (!selectedImageFile || !imageHash) {
      showErrorToast("Please upload tree proof image.");
      return;
    }

    try {
      setLoading(true);

      const proofId = `GDC-${Date.now()}`;

      const ipfs = await uploadFileToPinata(selectedImageFile);

      const draftRecord: TreeProofRecord = {
        id: proofId,
        matchName: form.matchName,
        overNumber: form.overNumber,
        bowlerName: form.bowlerName,
        treesCount: CAMPAIGN.treesPerDotBall,
        location: form.location,
        plantationDate: form.plantationDate,
        verifierName: form.verifierName,
        imageName,
        imageHash,
        imageIpfsCid: ipfs.cid,
        imageIpfsUrl: ipfs.url,
        issuerWallet: walletAddress,
        txHash: "",
        qrData: "",
        issuedAt: new Date().toISOString(),
        status: "Draft",
      };

      const realTxHash = await submitProofToBlockchain(wallet, draftRecord);

      await saveProofIndex({
        proofId,
        imageHash,
        txHash: realTxHash,
        imageIpfsCid: ipfs.cid,
        imageIpfsUrl: ipfs.url,
      });

      const finalRecord: TreeProofRecord = {
        ...draftRecord,
        txHash: realTxHash,
        qrData: `${window.location.origin}/proof/${realTxHash}`,
        status: "On-chain Verified",
      };

      setSuccessRecord(finalRecord);
      showSuccessToast("Tree proof verified and stored successfully.")
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Proof issuing failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      matchName: "",
      overNumber: "",
      bowlerName: "",
      location: "",
      plantationDate: "",
      verifierName: "",
    });

    setSelectedImageFile(null);
    setImageName("");
    setImageHash("");
    setSuccessRecord(null);
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-700" />
              <h2 className="text-xl font-bold text-gray-950">
                Issue Tree Proof
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Upload tree proof with IPL match details, IPFS storage, and
              Cardano blockchain verification data.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Body */}
        {successRecord ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

                <div className="mt-4 inline-flex rounded-full bg-green-100 px-6 py-3 text-lg font-bold text-green-700">
                  Proof Issued Successfully
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  Tree proof was uploaded to IPFS and registered on Cardano
                  blockchain.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                <h3 className="mb-4 text-lg font-bold text-green-900">
                  Proof Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Info label="Proof ID" value={successRecord.id} />
                  <Info label="Match" value={successRecord.matchName} />
                  <Info label="Over" value={successRecord.overNumber} />
                  <Info label="Bowler" value={successRecord.bowlerName} />
                  <Info label="Location" value={successRecord.location} />
                  <Info
                    label="Trees"
                    value={String(successRecord.treesCount)}
                  />
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-green-700">
                    Image SHA256 Hash
                  </p>
                  <p className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-xs text-green-900">
                    {successRecord.imageHash}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-green-700">
                    IPFS CID
                  </p>
                  <p className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-xs text-green-900">
                    {successRecord.imageIpfsCid}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-green-700">
                    Transaction Hash
                  </p>
                  <p className="mt-2 break-all rounded-xl bg-white p-3 font-mono text-xs text-green-900">
                    {successRecord.txHash}
                  </p>
                </div>
              </div>
            </div>

            {/* Success Footer */}
            <div className="shrink-0 flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => generateCertificatePDF(successRecord)}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </button>

              <button
                onClick={() =>
                  window.open(
                    getCardanoScanTxUrl(successRecord.txHash),
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50"
              >
                <ExternalLink className="h-4 w-4" />
                Explorer
              </button>

              <button
                onClick={closeModal}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-5">
                <FormInput
                  label="Match Name *"
                  value={form.matchName}
                  placeholder="e.g. CSK vs MI"
                  onChange={(value) => handleChange("matchName", value)}
                />

                <FormInput
                  label="Dot Ball Over *"
                  value={form.overNumber}
                  placeholder="e.g. 12.4"
                  onChange={(value) => handleChange("overNumber", value)}
                />

                <FormInput
                  label="Bowler Name *"
                  value={form.bowlerName}
                  placeholder="Enter bowler name"
                  onChange={(value) => handleChange("bowlerName", value)}
                />

                <FormInput
                  label="Plantation Location *"
                  value={form.location}
                  placeholder="Enter plantation location"
                  onChange={(value) => handleChange("location", value)}
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Plantation Date *
                  </label>

                  <input
                    type="date"
                    value={form.plantationDate}
                    onChange={(e) =>
                      handleChange("plantationDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <FormInput
                  label="Verifier / NGO Name *"
                  value={form.verifierName}
                  placeholder="Enter verifier or NGO name"
                  onChange={(value) => handleChange("verifierName", value)}
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Upload Tree Image *
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50 p-6 text-center transition hover:bg-green-100">
                    <Upload className="h-10 w-10 text-green-700" />

                    <p className="mt-3 font-semibold text-gray-900">
                      Click to upload image
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Image will be hashed and uploaded to IPFS.
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {imageName && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="font-bold text-green-800">
                      Image Hash Generated
                    </p>

                    <p className="mt-2 text-sm text-green-700">
                      File: {imageName}
                    </p>

                    <p className="mt-3 break-all text-xs leading-6 text-green-900">
                      {imageHash}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <h4 className="font-bold text-blue-900">
                    Blockchain Process
                  </h4>

                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-blue-800">
                    <li>Generates SHA256 hash from uploaded image</li>
                    <li>Uploads tree image to IPFS through Pinata</li>
                    <li>Stores proof metadata on Cardano transaction</li>
                    <li>Generates certificate and QR verification URL</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="shrink-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={issueProof}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Submitting to Cardano..." : "Upload & Issue"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-green-700">{label}</p>
      <p className="mt-1 break-all text-sm text-green-900">{value}</p>
    </div>
  );
}