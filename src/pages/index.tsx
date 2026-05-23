import Head from "next/head";
import { useRef } from "react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IssueProofSection from "@/components/IssueProofSection";
import VerifyProofSection from "@/components/VerifyProofSection";
import Footer from "@/components/Footer";

type SectionKey = "home" | "features" | "how" | "issue" | "verify";

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const issueRef = useRef<HTMLDivElement>(null);
  const verifyRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: SectionKey) => {
    const refs = {
      home: homeRef,
      features: featuresRef,
      how: howRef,
      issue: issueRef,
      verify: verifyRef,
    };

    refs[section].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Head>
        <title>GreenDot Chain</title>

        <meta
          name="description"
          content="Blockchain based IPL Tree Plantation Proof Verification Platform"
        />
      </Head>

      <main className="min-h-screen bg-white text-gray-900">
        <Header scrollToSection={scrollToSection} />

        {/* HERO */}
        <section
          ref={homeRef}
          id="home"
          className="scroll-mt-28"
        >
          <HeroSection scrollToSection={scrollToSection} />
        </section>

        {/* FEATURES */}
        <section
          ref={featuresRef}
          id="features"
          className="scroll-mt-28"
        >
          <FeaturesSection />
        </section>

        {/* HOW IT WORKS */}
        <section
          ref={howRef}
          id="how"
          className="scroll-mt-28"
        >
          <HowItWorksSection />
        </section>

        {/* ISSUE PROOF */}
        <section
          ref={issueRef}
          id="issue"
          className="scroll-mt-28"
        >
          <IssueProofSection />
        </section>

        {/* VERIFY */}
        <section
          ref={verifyRef}
          id="verify"
          className="scroll-mt-28"
        >
          <VerifyProofSection />
        </section>

        <Footer />
      </main>
    </>
  );
}