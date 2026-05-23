import {
  Fingerprint,
  ImageUp,
  QrCode,
  ShieldCheck,
  FileText,
  Globe2,
} from "lucide-react";

const features = [
  {
    icon: ImageUp,
    title: "IPFS Image Storage",
    text: "Tree proof images are uploaded to IPFS using Pinata for decentralized access.",
  },
  {
    icon: Fingerprint,
    title: "SHA256 Image Hashing",
    text: "Each uploaded image receives a unique cryptographic hash for tamper detection.",
  },
  {
    icon: ShieldCheck,
    title: "Cardano Proof Storage",
    text: "Proof metadata is stored on Cardano as immutable transaction metadata.",
  },
  {
    icon: FileText,
    title: "Certificate Generation",
    text: "A professional PDF certificate is generated with proof details and hashes.",
  },
  {
    icon: QrCode,
    title: "QR Proof Access",
    text: "QR codes open a public proof page with blockchain and IPFS verification details.",
  },
  {
    icon: Globe2,
    title: "Public Verification",
    text: "Anyone can verify proof authenticity using the transaction hash and image proof.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200">
            Platform Features
          </span>

          <h2 className="mt-5 text-4xl font-black text-gray-950 md:text-5xl">
            Built for trusted green proof verification
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            GreenDot Chain combines IPFS, Cardano metadata, QR certificates,
            and cryptographic hashing to verify sustainability proof records.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <item.icon className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-xl font-black text-gray-950">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}