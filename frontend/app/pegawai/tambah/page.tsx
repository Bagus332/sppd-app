"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
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

  const PEGAWAI_ENDPOINT = "http://localhost:8080/api/pegawai";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6 md:p-10 text-gray-800">
      {/* Header Navigasi */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/pegawai")}
          className="flex items-center gap-2 text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Card Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Input: Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full border border-green-300 bg-green-50 rounded-lg p-3 text-gray-900 placeholder-green-700/60 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          {/* Input: Tanggal Lahir */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              className="w-full border border-green-300 bg-green-50 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          {/* Input: NIP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              NIP
            </label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              placeholder="Masukkan NIP"
              className="w-full border border-green-300 bg-green-50 rounded-lg p-3 text-gray-900 placeholder-green-700/60 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          {/* ComboBox: Pangkat & Golongan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pangkat dan Golongan
            </label>
            <select
              name="pangkat_golongan"
              value={formData.pangkat_golongan}
              onChange={handleChange}
              required
              className="w-full border border-green-300 bg-green-50 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=\'%2300A86B\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.75rem_center]"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Jabatan / Instansi
            </label>
            <input
              type="text"
              name="jabatan_instansi"
              value={formData.jabatan_instansi}
              onChange={handleChange}
              required
              placeholder="Contoh: Staf Keuangan - UIN Imam Bonjol Padang"
              className="w-full border border-green-300 bg-green-50 rounded-lg p-3 text-gray-900 placeholder-green-700/60 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Simpan Data Pegawai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahPegawai;
