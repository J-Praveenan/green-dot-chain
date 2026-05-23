"use client";

import Image from "next/image";
import { CAMPAIGN } from "@/lib/constants";

type SectionKey = "home" | "features" | "how" | "issue" | "verify";

type HeroSectionProps = {
  scrollToSection: (section: SectionKey) => void;
};

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-semibold text-green-700">
            {CAMPAIGN.season} Sustainability Verification
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-gray-950 md:text-6xl">
            Verify Sustainability Proofs on{" "}
            <span className="text-green-700">Cardano Blockchain</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            GreenDot Chain is a blockchain-powered proof verification platform
            for IPL sustainability campaigns using Cardano, SHA256 hashing, and
            decentralized verification.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("issue")}
              className="rounded-2xl bg-green-700 px-7 py-4 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Issue Proof
            </button>

            <button
              onClick={() => scrollToSection("verify")}
              className="rounded-2xl border border-green-200 bg-white px-7 py-4 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Verify Proof
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["SHA256", "Cardano", "IPFS"].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-green-100 bg-green-50 p-5"
              >
                <h3 className="text-3xl font-black text-green-700">{item}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item === "SHA256"
                    ? "File hashing verification"
                    : item === "Cardano"
                    ? "Immutable blockchain proof"
                    : "Decentralized storage"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[520px] items-center justify-center">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-green-100 blur-3xl" />

          <Image
            src="/images/Bowlling.gif"
            alt="Bowling Animation"
            width={700}
            height={700}
            className="relative z-10 w-full max-w-xl object-contain"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}