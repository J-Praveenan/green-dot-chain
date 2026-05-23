import { useState } from "react";
import { Search, ShieldCheck, Upload } from "lucide-react";
import VerifyProofModal from "./VerifyProofModal";

export default function VerifyProofSection() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200">
            Verify Tree Proof
          </span>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
                Verify planted tree image authenticity.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                Upload a tree proof image and compare its SHA256 hash with the
                issued proof registry. If the image was changed, verification
                will fail.
              </p>

              <button
                onClick={() => setOpenModal(true)}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-green-700 px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-green-800"
              >
                <Search className="h-5 w-5" />
                Open Verify Form
              </button>
            </div>

            <div className="rounded-[2rem] border border-green-100 bg-green-50 p-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-700 text-white">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-gray-950">
                Verification Checks
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Upload className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    Upload the original planted tree image
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Upload className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    Generate image SHA256 hash in browser
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Upload className="mt-1 h-5 w-5 text-green-700" />
                  <p className="text-gray-700">
                    Compare against issued proof registry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VerifyProofModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </section>
  );
}