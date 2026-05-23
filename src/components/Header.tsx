"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";
import { APP_NAME } from "@/lib/constants";
import { useWallet } from "@meshsdk/react";

type SectionKey = "home" | "features" | "how" | "issue" | "verify";

type HeaderProps = {
  scrollToSection: (section: SectionKey) => void;
};

const navItems = [
  { label: "Home", value: "home" },
  { label: "Features", value: "features" },
  { label: "How It Works", value: "how" },
  { label: "Issue Proof", value: "issue" },
  { label: "Verify", value: "verify" },
] as const;

export default function Header({ scrollToSection }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [address, setAddress] = useState("");

  const { connected, wallet } = useWallet();

  useEffect(() => {
    const loadWallet = async () => {
      if (!connected || !wallet) {
        setAddress("");
        return;
      }

      try {
        const addresses = await wallet.getUsedAddresses();

        if (addresses.length > 0) {
          setAddress(addresses[0]);
        }
      } catch (error) {
        console.log("Failed to load wallet address", error);
      }
    };

    loadWallet();
  }, [connected, wallet]);

  const shortAddress =
    address.length > 20
      ? `${address.slice(0, 10)}...${address.slice(-6)}`
      : address;

  const handleClick = (section: SectionKey) => {
    setActiveSection(section);
    scrollToSection(section);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <button
          onClick={() => handleClick("home")}
          className="flex items-center gap-3 text-left"
        >
          <Image
            src="/images/tata-ipl.png"
            alt="TATA IPL"
            width={86}
            height={48}
            className="object-contain"
          />

          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-green-700">{APP_NAME}</h1>
            <p className="text-xs font-medium text-gray-500">
              Blockchain Proof Verification
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleClick(item.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeSection === item.value
                  ? "bg-green-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <WalletConnect />
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-green-200 p-2 text-green-700 lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-green-100 bg-white px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleClick(item.value)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  activeSection === item.value
                    ? "bg-green-700 text-white"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3">
              {connected && address && (
                <div className="mb-3 rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white">
                  {shortAddress}
                </div>
              )}

              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}