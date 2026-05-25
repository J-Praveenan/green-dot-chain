"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";

import { CAMPAIGN } from "@/lib/constants";
import { generateSHA256 } from "@/lib/hash";
import {
  uploadFileToPinata,
  submitProofToBlockchain,
  getCardanoScanTxUrl,
  openTxInExplorer,
} from "@/lib/blockchain";
import {
  checkDuplicateImageHash,
  saveProofIndex,
} from "@/lib/proofRegistry";
import { generateCertificatePDF } from "@/lib/certificate";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import type { TreeProofRecord } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const IPL_TEAMS = [
  "CSK",
  "MI",
  "RCB",
  "KKR",
  "SRH",
  "DC",
  "RR",
  "GT",
  "LSG",
  "PBKS",
];

export default function IssueProofModal({ open, onClose }: Props) {
  const { wallet } = useWallet();

  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [successRecord, setSuccessRecord] = useState<TreeProofRecord | null>(
    null
  );

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageHash, setImageHash] = useState("");

  const [form, setForm] = useState({
    teamOne: "",
    teamTwo: "",
    overNumber: "",
    bowlerName: "",
    location: "",
    plantationDate: "",
    verifierName: "",
  });

  if (!open) return null;

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      teamOne: "",
      teamTwo: "",
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const hash = await generateSHA256(file);

      setSelectedImageFile(file);
      setImageName(file.name);
      setImageHash(hash);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to generate image hash.");
    } finally {
      setLoading(false);
    }
  };

  const isValidT20Over = (value: string) => {
    const overRegex = /^(?:[0-9]|1[0-9])\.[1-6]$|^20\.0$/;

    return overRegex.test(value);
  };

  const isFutureDate = (dateValue: string) => {
    const selectedDate = new Date(dateValue);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  };

  const issueProof = async () => {
    if (
      !form.teamOne ||
      !form.teamTwo ||
      !form.overNumber ||
      !form.bowlerName ||
      !form.location ||
      !form.plantationDate ||
      !form.verifierName ||
      !imageHash ||
      !selectedImageFile
    ) {
      showErrorToast("Please fill all required proof details before submitting.");
      return;
    }

    if (form.teamOne === form.teamTwo) {
      showErrorToast("Please select two different IPL teams.");
      return;
    }

    if (!wallet) {
      showErrorToast("Please connect your Cardano wallet to issue a proof.");
      return;
    }

    if (!isValidT20Over(form.overNumber)) {
      showErrorToast(
        "Please enter a valid T20 over between 0.1 and 20.0."
      );
      return;
    }

    if (isFutureDate(form.plantationDate)) {
      showErrorToast(
        "Plantation date cannot be a future date."
      );
      return;
    }


    try {
      setLoading(true);

      const duplicate = await checkDuplicateImageHash(imageHash);

      if (duplicate) {
        showErrorToast(
          "This tree proof image has already been registered."
        );
        return;
      }

      const proofId = `GDC-${Date.now()}`;
      const matchName = `${form.teamOne} vs ${form.teamTwo}`;

      const ipfs = await uploadFileToPinata(selectedImageFile);

      const draftRecord: TreeProofRecord = {
        id: proofId,
        matchName,
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

      const finalRecord: TreeProofRecord = {
        ...draftRecord,
        txHash: realTxHash,
        qrData: `${window.location.origin}/proof/${realTxHash}`,
        status: "On-chain Verified",
      };

      await saveProofIndex({
        proofId,
        imageHash,
        txHash: realTxHash,
        imageIpfsCid: ipfs.cid,
        imageIpfsUrl: ipfs.url,
      });

      setSuccessRecord(finalRecord);

      showSuccessToast(
        "Tree plantation proof successfully recorded on Cardano."
      );
    } catch (error) {
      console.error(error);

      showErrorToast(
        "Unable to issue proof. Please check your wallet, network, and try again."
      );
    } finally {
      setLoading(false);
    }
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
                Issue Tree Plantation Proof
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add IPL match details, upload the tree plantation proof image, and record the proof on Cardano blockchain.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success View */}
        {successRecord ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

                <div className="mt-4 inline-flex rounded-full bg-green-100 px-6 py-3 text-lg font-bold text-green-700">
                  Proof Issued Successfully
                </div>
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
                  <Info label="Image" value={successRecord.imageName} />
                </div>

                <HashBlock
                  label="Image Hash"
                  value={successRecord.imageHash}
                />

                <HashBlock
                  label="Transaction Hash"
                  value={successRecord.txHash}
                />

                <HashBlock
                  label="IPFS CID"
                  value={successRecord.imageIpfsCid}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <AlertCircle className="mt-1 h-5 w-5 text-blue-700" />
                  <div>
                    <h4 className="font-bold text-blue-900">
                      Important Verification Notice
                    </h4>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-blue-800">
                      <li>Save the certificate PDF for future verification.</li>
                      <li>The QR code opens the public proof page.</li>
                      <li>
                        The image hash and IPFS CID are stored with Cardano
                        metadata.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-white px-6 py-5">
              <button
                onClick={() => generateCertificatePDF(successRecord)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </button>

              <button
                onClick={() => openTxInExplorer(successRecord.txHash)}
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50"
              >
                <ExternalLink className="h-4 w-4" />
                Explorer
              </button>

              <button
                onClick={resetForm}
                className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Upload Another
              </button>

              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-5">
                {/* Match Dropdown */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    IPL Match *
                  </label>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <select
                      value={form.teamOne}
                      onChange={(e) =>
                        handleChange("teamOne", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    >
                      <option value="">Select Team</option>
                      {IPL_TEAMS.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>

                    <span className="text-center text-sm font-black text-green-700">
                      VS
                    </span>

                    <select
                      value={form.teamTwo}
                      onChange={(e) =>
                        handleChange("teamTwo", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    >
                      <option value="">Select Team</option>
                      {IPL_TEAMS.filter(
                        (team) => team !== form.teamOne
                      ).map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.teamOne && form.teamTwo && (
                    <div className="mt-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                      <p className="text-sm font-semibold text-green-700">
                        Selected Match
                      </p>
                      <h3 className="mt-1 text-lg font-black text-gray-950">
                        {form.teamOne} vs {form.teamTwo}
                      </h3>
                    </div>
                  )}
                </div>

                <Input
                  label="Dot Ball Over *"
                  value={form.overNumber}
                  placeholder="Example: 0.1, 12.4, 19.6, 20.0"
                  onChange={(value) => handleChange("overNumber", value)}
                />

                <Input
                  label="Bowler Name *"
                  value={form.bowlerName}
                  placeholder="Example: Pathirana"
                  onChange={(value) => handleChange("bowlerName", value)}
                />

                <Input
                  label="Plantation Location *"
                  value={form.location}
                  placeholder="Example: Mumbai"
                  onChange={(value) => handleChange("location", value)}
                />

                <Input
                  type="date"
                  label="Plantation Date *"
                  value={form.plantationDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(value) => handleChange("plantationDate", value)}
                />

                <Input
                  label="Verifier / NGO Name *"
                  value={form.verifierName}
                  placeholder="Example: Green Earth Foundation"
                  onChange={(value) => handleChange("verifierName", value)}
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Upload Tree Image *
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50 p-8 text-center transition hover:bg-green-100">
                    <Upload className="h-12 w-12 text-green-700" />

                    <p className="mt-3 font-semibold text-gray-900">
                      Click to upload or drag and drop
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      JPG, PNG, WEBP up to 10MB
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {imageHash && (
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
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-5">
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={issueProof}
                disabled={loading}
                className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Processing..." : "Upload & Issue"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
    max?: string;

}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-green-700">{label}:</p>
      <p className="break-all text-sm text-green-900">{value}</p>
    </div>
  );
}

function HashBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-bold text-green-700">{label}:</p>
      <p className="mt-1 break-all text-xs leading-6 text-green-900">
        {value}
      </p>
    </div>
  );
}