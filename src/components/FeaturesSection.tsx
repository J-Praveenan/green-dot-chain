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
    title: "Decentralized Image Storage",
    text: "Tree plantation proof images are securely stored on IPFS using Pinata for permanent decentralized access.",
  },
  {
    icon: Fingerprint,
    title: "Secure SHA256 Verification",
    text: "Each uploaded image receives a unique SHA256 hash to ensure authenticity and detect tampering.",
  },
  {
    icon: ShieldCheck,
    title: "Cardano Blockchain Storage",
    text: "Proof metadata is permanently recorded on the Cardano blockchain for transparent verification.",
  },
  {
    icon: FileText,
    title: "Blockchain Certificate Generation",
    text: "Generate professional blockchain certificates containing proof details, hashes, and verification data.",
  },
  {
    icon: QrCode,
    title: "QR-Based Verification",
    text: "QR codes provide instant access to public proof verification and blockchain transaction details.",
  },
  {
    icon: Globe2,
    title: "Public Proof Verification",
    text: "Anyone can verify the authenticity of sustainability proofs using blockchain transaction data.",
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
            and cryptographic hashing and QR verification to create trusted and
            transparent sustainability proof records.
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