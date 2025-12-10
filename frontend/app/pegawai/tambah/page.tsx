"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft, Save } from "lucide-react";
import { apiClient, API_ENDPOINTS } from "@/lib/api-client";

const TambahPegawai: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    tanggal_lahir: "",
    nip: "",
    pangkat_golongan: "",
    jabatan_instansi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post(API_ENDPOINTS.PEGAWAI, formData);

      alert("✅ Data pegawai berhasil ditambahkan!");
      router.push("/pegawai");
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat menambahkan data pegawai.");
    }
  };

  const pangkatGolonganOptions = [
    "Juru Muda (I/a)",
    "Juru Muda Tingkat I (I/b)",
    "Juru (I/c)",
    "Juru Tingkat I (I/d)",
    "Pengatur Muda (II/a)",
    "Pengatur Muda Tingkat I (II/b)",
    "Pengatur (II/c)",
    "Pengatur Tingkat I (II/d)",
    "Penata Muda (III/a)",
    "Penata Muda Tingkat I (III/b)",
    "Penata (III/c)",
    "Penata Tingkat I (III/d)",
    "Pembina (IV/a)",
    "Pembina Tingkat I (IV/b)",
    "Pembina Utama Muda (IV/c)",
    "Pembina Utama Madya (IV/d)",
    "Pembina Utama (IV/e)",
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 p-6">
      {/* Header Navigasi */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/pegawai")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Card Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
        <div className="mb-8 border-b border-neutral-100 pb-4">
            <h1 className="text-2xl font-bold text-[#5c7a54]">Tambah Pegawai Baru</h1>
            <p className="text-neutral-500">Lengkapi formulir di bawah ini untuk menambahkan data pegawai baru.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Input: Nama */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
            />
          </div>

          {/* Input: Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
            />
          </div>

          {/* Input: NIP */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              NIP
            </label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              placeholder="Masukkan NIP"
              inputMode="numeric"
              pattern="[0-9]*" 
              className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
            />
          </div>


          {/* ComboBox: Pangkat & Golongan */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Pangkat dan Golongan
            </label>
            <select
              name="pangkat_golongan"
              value={formData.pangkat_golongan}
              onChange={handleChange}
              required
              className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
            >
              <option value="">-- Pilih --</option>
              {pangkatGolonganOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Input: Jabatan Instansi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Jabatan / Instansi
            </label>
            <input
              type="text"
              name="jabatan_instansi"
              value={formData.jabatan_instansi}
              onChange={handleChange}
              required
              placeholder="Contoh: Staf Keuangan - UIN Imam Bonjol Padang"
              className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="md:col-span-2 flex justify-end mt-6 pt-6 border-t border-neutral-100">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#5c7a54] hover:bg-[#4a6344] text-white px-6 py-3 rounded-lg shadow-sm transition-all duration-200 font-medium"
            >
              <Save className="w-5 h-5" />
              Simpan Data Pegawai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahPegawai;
