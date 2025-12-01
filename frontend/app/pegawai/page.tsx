"use client";

import PegawaiForm from "../components/PegawaiForm";

export default function PegawaiPage() {
  return (
    <div className="min-h-screen bg-neutral-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow p-6">
          <PegawaiForm />
        </div>
      </div>
    </div>
  );
}
