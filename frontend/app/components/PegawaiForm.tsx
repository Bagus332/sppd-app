"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

type Pegawai = {
  id: number;
  nama: string;
  tanggal_lahir: string;
  nip: string;
  pangkat_golongan: string;
  jabatan_instansi: string;
};

const PegawaiForm: React.FC = () => {
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [formData, setFormData] = useState({
    nama: "",
    tanggal_lahir: "",
    nip: "",
    pangkat_golongan: "",
    jabatan_instansi: "",
  });

  // URL backend
  const PEGAWAI_ENDPOINT = "http://localhost:8080/api/pegawai";

  // Ambil data pegawai dari backend
  const fetchPegawai = async () => {
    try {
      const res = await fetch(PEGAWAI_ENDPOINT, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Gagal mengambil data pegawai (status ${res.status})`);

      const result = await res.json();
      console.log("📦 Data pegawai dari backend:", result);

      // Pastikan result berupa array
      const dataArray = Array.isArray(result) ? result : result.data;
      setPegawai(dataArray || []);
    } catch (err) {
      console.error("❌ Gagal memuat data pegawai:", err);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Handle perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simpan data baru ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(PEGAWAI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error("Response error:", res.status, res.statusText);
        throw new Error("Gagal menambahkan data pegawai");
      }

      alert("✅ Data pegawai berhasil ditambahkan!");

      // Reset form
      setFormData({
        nama: "",
        tanggal_lahir: "",
        nip: "",
        pangkat_golongan: "",
        jabatan_instansi: "",
      });

      // Ambil ulang data terbaru agar tabel ter-update
      await fetchPegawai();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menambahkan data pegawai. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-8 text-gray-800">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-full">
          <Users className="text-green-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Data Pegawai</h2>
          <p className="text-gray-500 text-sm">
            Lihat dan kelola data pegawai yang tersedia.
          </p>
        </div>
      </div>

      {/* Form Tambah Pegawai */}
      <div className="bg-green-50 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-green-700 w-5 h-5" />
          <h3 className="text-lg font-semibold text-green-700">
            Tambah Data Pegawai
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 bg-white"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 text-gray-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NIP</label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 bg-white"
              placeholder="Masukkan NIP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pangkat dan Golongan</label>
            <input
              type="text"
              name="pangkat_golongan"
              value={formData.pangkat_golongan}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 bg-white"
              placeholder="Contoh: Penata Muda (III/a)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Jabatan / Instansi</label>
            <input
              type="text"
              name="jabatan_instansi"
              value={formData.jabatan_instansi}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-500 bg-white"
              placeholder="Contoh: Staf Keuangan - UIN Imam Bonjol Padang"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-sm"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Data Pegawai */}
      <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto text-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Daftar Pegawai</h3>

        <table className="min-w-full border border-gray-200 text-sm text-left text-gray-800">
          <thead className="bg-green-100 text-green-800 font-medium">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Tanggal Lahir</th>
              <th className="p-3 border">NIP</th>
              <th className="p-3 border">Pangkat / Golongan</th>
              <th className="p-3 border">Jabatan / Instansi</th>
            </tr>
          </thead>
          <tbody>
            {pegawai.length > 0 ? (
              pegawai.map((p, i) => (
                <tr key={p.id || i} className="hover:bg-green-50 transition-colors">
                  <td className="p-3 border">{i + 1}</td>
                  <td className="p-3 border">{p.nama}</td>
                  <td className="p-3 border">{p.tanggal_lahir}</td>
                  <td className="p-3 border">{p.nip}</td>
                  <td className="p-3 border">{p.pangkat_golongan}</td>
                  <td className="p-3 border">{p.jabatan_instansi}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500 italic">
                  Belum ada data pegawai yang tersimpan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PegawaiForm;
