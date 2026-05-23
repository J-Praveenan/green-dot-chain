import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  CalendarDays,
  ExternalLink,
  Hash,
  MapPin,
  ShieldCheck,
  TreePine,
  UserCheck,
} from "lucide-react";

import { fetchTransactionMetadata } from "@/lib/blockchain";
import { getCardanoScanTxUrl } from "@/lib/blockchain";

type ProofData = {
  proofId?: string;
  matchName?: string;
  match?: string;
  overNumber?: string;
  over?: string;
  bowlerName?: string;
  bowler?: string;
  location?: string;
  verifierName?: string;
  verifier?: string;
  plantationDate?: string;
  treesCount?: number;
  trees?: number;
  imageHash?: string | string[];
  imageCid?: string;
  imageUrl?: string | string[];
};

function joinIfArray(value?: string | string[]) {
  if (!value) return "";
  return Array.isArray(value) ? value.join("") : value;
}

export default function ProofPage() {
  const router = useRouter();
  const { txHash } = router.query;

  const [proof, setProof] = useState<ProofData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProof = async () => {
      if (!txHash || typeof txHash !== "string") return;

      setLoading(true);

      const metadataResponse = await fetchTransactionMetadata(txHash);

      if (!metadataResponse.success) {
        setProof(null);
        setLoading(false);
        return;
      }

      const metadata = metadataResponse.data;     
      const proofMetadata = metadata?.find((item: any) => item.label === "2026");

      setProof(proofMetadata?.json_metadata || null);
      setLoading(false);
    };

    loadProof();
  }, [txHash]);

  const imageUrl =
    joinIfArray(proof?.imageUrl) ||
    (proof?.imageCid
      ? `https://gateway.pinata.cloud/ipfs/${proof.imageCid}`
      : "");

  return (
    <>
      <Head>
        <title>GreenDot Proof Verification</title>
      </Head>

      <main className="min-h-screen bg-green-50 px-4 py-5 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-5 shadow-xl md:p-7">
          {loading && (
            <p className="text-center font-semibold text-green-700">
              Loading blockchain proof...
            </p>
          )}

          {!loading && !proof && (
            <div className="text-center">
              <h1 className="text-3xl font-black text-red-700">
                Proof Not Found
              </h1>
              <p className="mt-3 text-gray-600">
                No GreenDot Chain metadata was found for this transaction.
              </p>
            </div>
          )}

          {!loading && proof && (
            <>
              
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                    <ShieldCheck className="h-4 w-4" />
                    Verified On Cardano
                  </div>

                  <h1 className="mt-3 text-3xl font-black text-gray-950 md:text-4xl">
                    GreenDot Chain Tree Proof
                  </h1>

                  <p className="mt-2 text-sm text-gray-600 md:text-base">
                    This proof was fetched directly from Cardano blockchain metadata.
                  </p>
                </div>

                <a
                  href={getCardanoScanTxUrl(String(txHash))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  View CardanoScan
                </a>
              </div>

              
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                {imageUrl && (
                  <div className="overflow-hidden rounded-[1.5rem] border border-green-100 bg-green-50">
                    <img
                      src={imageUrl}
                      alt="Tree plantation proof"
                      className="h-[280px] w-full object-cover lg:h-full"
                    />
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Proof ID" value={proof.proofId} />
                  <Info label="Match" value={proof.matchName || proof.match} />
                  <Info label="Over" value={proof.overNumber || proof.over} />
                  <Info label="Bowler" value={proof.bowlerName || proof.bowler} />
                  <Info icon={<MapPin />} label="Location" value={proof.location} />
                  <Info
                    icon={<CalendarDays />}
                    label="Plantation Date"
                    value={proof.plantationDate}
                  />
                  <Info
                    icon={<UserCheck />}
                    label="Verifier"
                    value={proof.verifierName || proof.verifier}
                  />
                  <Info
                    icon={<TreePine />}
                    label="Trees Allocated"
                    value={String(proof.treesCount || proof.trees || "")}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-green-100 bg-green-50 p-5">
                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-green-700" />
                    <h2 className="text-lg font-black text-gray-950">
                      Image Verification Hash
                    </h2>
                  </div>

                  <p className="mt-3 break-all rounded-2xl bg-white p-4 font-mono text-xs leading-6 text-gray-700">
                    {joinIfArray(proof.imageHash)}
                  </p>
                </div>

                <div className="rounded-3xl bg-gray-50 p-5">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-green-700" />
                    <h2 className="text-lg font-black text-gray-950">
                      Transaction Hash
                    </h2>
                  </div>

                  <p className="mt-3 break-all rounded-2xl bg-white p-4 font-mono text-xs leading-6 text-gray-700">
                    {txHash}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-green-700 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        <p className="text-sm font-bold text-green-700">{label}</p>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-950">{value || "-"}</p>
    </div>
  );
}