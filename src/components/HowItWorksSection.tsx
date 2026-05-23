"use client";

import Image from "next/image";
import {
  UploadCloud,
  Fingerprint,
  Database,
  QrCode,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Tree Proof",
    text: "User uploads a planted tree image with IPL match and plantation details.",
  },
  {
    icon: Fingerprint,
    title: "Generate SHA256 Hash",
    text: "The browser generates a unique image hash for tamper-proof verification.",
  },
  {
    icon: Database,
    title: "Store on Cardano + IPFS",
    text: "Image is uploaded to IPFS and proof metadata is stored on Cardano blockchain.",
  },
  {
    icon: QrCode,
    title: "Generate Certificate QR",
    text: "A PDF certificate is created with transaction hash, image hash, and QR link.",
  },
  {
    icon: ShieldCheck,
    title: "Verify Publicly",
    text: "Anyone can scan the QR and view the verified proof page with blockchain data.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200">
              How It Works
            </span>

            <h2 className="mt-5 text-4xl font-black text-gray-950 md:text-5xl">
              From tree image to blockchain proof
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The platform follows a clear verification workflow where each
              image becomes a permanent sustainability proof on Cardano.
            </p>

            <div className="relative mt-10 flex items-center justify-center overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="absolute h-72 w-72 rounded-full bg-green-100 blur-3xl" />

              <Image
                src="/images/Farmer-new.gif"
                alt="Tree plantation animation"
                width={520}
                height={420}
                className="relative z-10 w-full max-w-md object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-5 rounded-[2rem] border border-green-100 bg-white p-5 shadow-sm"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white">
                  <step.icon className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-green-700">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-1 text-xl font-black text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}