"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Users,
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

type Pegawai = {
  id: number;
  nama: string;
  tanggal_lahir: string;
  nip: string;
  pangkat_golongan: string;
  jabatan_instansi: string;
};

const PegawaiForm: React.FC = () => {
  const router = useRouter();
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

  const PEGAWAI_ENDPOINT = "http://localhost:8080/api/pegawai";

  // ambil data pegawai
  const fetchPegawai = async () => {
    try {
      const res = await fetch(PEGAWAI_ENDPOINT);
      const data = await res.json();
      setPegawai(Array.isArray(data) ? data : data.data);
    } catch (err) {
      console.error("❌ Gagal memuat data pegawai:", err);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);


  // buka modal edit
  const handleEdit = (p: Pegawai) => {
    setSelectedPegawai(p);
    setIsEditing(true);
  };

  // hapus pegawai
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`${PEGAWAI_ENDPOINT}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      console.log("Delete Status:", res.status, "Response:", data);

      if (!res.ok) throw new Error("Gagal menghapus data pegawai");

      alert("🗑️ Data pegawai berhasil dihapus!");
      fetchPegawai();
    } catch (err) {
      console.error("❌ handleDelete error:", err);
      alert("❌ Gagal menghapus data pegawai.");
    }
  };

  // update data pegawai
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPegawai) return; // pastikan ada pegawai yang sedang diedit

    try {
      const res = await fetch(`${PEGAWAI_ENDPOINT}/${selectedPegawai.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPegawai),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Update Status:", res.status, "Response:", data);

      if (!res.ok) throw new Error("Gagal memperbarui data pegawai");

      alert("✅ Data pegawai berhasil diperbarui!");
      setIsEditing(false);
      setSelectedPegawai(null); // reset form edit
      fetchPegawai(); // reload data terbaru
    } catch (err) {
      console.error("❌ handleUpdate error:", err);
      alert("❌ Gagal memperbarui data pegawai.");
    }
  };


  return (
    <div className="space-y-8 text-gray-800">
      {/* Tombol navigasi */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium px-4 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <button
          onClick={() => router.push("/pegawai/tambah")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          <UserPlus className="w-5 h-5" />
          Tambah Pegawai
        </button>
      </div>

      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-full">
          <Users className="text-green-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Data Pegawai</h2>
          <p className="text-gray-500 text-sm">Kelola seluruh data pegawai.</p>
        </div>
      </div>

      {/* Tabel Data Pegawai */}
      <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto text-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Daftar Pegawai
        </h3>

        <table className="min-w-full border border-gray-200 text-sm text-left text-gray-800">
          <thead className="bg-green-100 text-green-800 font-medium">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Tanggal Lahir</th>
              <th className="p-3 border">NIP</th>
              <th className="p-3 border">Pangkat / Golongan</th>
              <th className="p-3 border">Jabatan / Instansi</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pegawai.length > 0 ? (
              pegawai.map((p, i) => (
                <tr
                  key={p.id || i}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="p-3 border">{i + 1}</td>
                  <td className="p-3 border">{p.nama}</td>
                  <td className="p-3 border">{p.tanggal_lahir}</td>
                  <td className="p-3 border">{p.nip}</td>
                  <td className="p-3 border">{p.pangkat_golongan}</td>
                  <td className="p-3 border">{p.jabatan_instansi}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500 italic">
                  Belum ada data pegawai yang tersimpan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {isEditing && selectedPegawai && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative border border-green-100">
            {/* Tombol close */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Judul */}
            <h3 className="text-2xl font-semibold text-green-700 mb-6 text-center">
              ✏️ Edit Data Pegawai
            </h3>

            {/* Form Edit */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                name="nama"
                value={selectedPegawai.nama}
                onChange={(e) =>
                  setSelectedPegawai({ ...selectedPegawai, nama: e.target.value })
                }
                className="w-full border border-green-300 bg-green-50 p-3 rounded-lg"
              />
              <input
                type="date"
                name="tanggal_lahir"
                value={selectedPegawai.tanggal_lahir}
                onChange={(e) =>
                  setSelectedPegawai({
                    ...selectedPegawai,
                    tanggal_lahir: e.target.value,
                  })
                }
                className="w-full border border-green-300 bg-green-50 p-3 rounded-lg"
              />
              <input
                type="text"
                placeholder="NIP"
                name="nip"
                value={selectedPegawai.nip}
                onChange={(e) =>
                  setSelectedPegawai({ ...selectedPegawai, nip: e.target.value })
                }
                className="w-full border border-green-300 bg-green-50 p-3 rounded-lg"
              />
              <select
                name="pangkat_golongan"
                value={selectedPegawai.pangkat_golongan}
                onChange={(e) =>
                  setSelectedPegawai({
                    ...selectedPegawai,
                    pangkat_golongan: e.target.value,
                  })
                }
                className="w-full border border-green-300 bg-green-50 p-3 rounded-lg"
              >
                <option value="">-- Pilih Pangkat / Golongan --</option>
                <option value="Juru Muda (I/a)">Juru Muda (I/a)</option>
                <option value="Juru Muda Tk.I (I/b)">Juru Muda Tk.I (I/b)</option>
                <option value="Juru (I/c)">Juru (I/c)</option>
                <option value="Juru Tk.I (I/d)">Juru Tk.I (I/d)</option>
                <option value="Pengatur Muda (II/a)">Pengatur Muda (II/a)</option>
                <option value="Pengatur Muda Tk.I (II/b)">Pengatur Muda Tk.I (II/b)</option>
                <option value="Pengatur (II/c)">Pengatur (II/c)</option>
                <option value="Pengatur Tk.I (II/d)">Pengatur Tk.I (II/d)</option>
                <option value="Penata Muda (III/a)">Penata Muda (III/a)</option>
                <option value="Penata Muda Tk.I (III/b)">Penata Muda Tk.I (III/b)</option>
                <option value="Penata (III/c)">Penata (III/c)</option>
                <option value="Penata Tk.I (III/d)">Penata Tk.I (III/d)</option>
                <option value="Pembina (IV/a)">Pembina (IV/a)</option>
                <option value="Pembina Tk.I (IV/b)">Pembina Tk.I (IV/b)</option>
                <option value="Pembina Utama Muda (IV/c)">Pembina Utama Muda (IV/c)</option>
                <option value="Pembina Utama Madya (IV/d)">Pembina Utama Madya (IV/d)</option>
                <option value="Pembina Utama (IV/e)">Pembina Utama (IV/e)</option>
              </select>
              <input
                type="text"
                placeholder="Jabatan / Instansi"
                name="jabatan_instansi"
                value={selectedPegawai.jabatan_instansi}
                onChange={(e) =>
                  setSelectedPegawai({
                    ...selectedPegawai,
                    jabatan_instansi: e.target.value,
                  })
                }
                className="w-full border border-green-300 bg-green-50 p-3 rounded-lg"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PegawaiForm;
