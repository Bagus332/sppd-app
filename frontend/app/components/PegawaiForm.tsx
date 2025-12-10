"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
} from "lucide-react";
import { apiClient, API_ENDPOINTS } from "@/lib/api-client";

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
  const [search, setSearch] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

  // =============================
  // FETCH DATA
  // =============================
  const fetchPegawai = async () => {
    try {
      const data = await apiClient.get<Pegawai[] | { data: Pegawai[] }>(
        API_ENDPOINTS.PEGAWAI
      );
      setPegawai(Array.isArray(data) ? data : (data as any).data || []);
    } catch (err) {
      console.error("❌ Gagal memuat data pegawai:", err);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // =============================
  // FILTER DATA BERDASARKAN SEARCH
  // =============================
  const filteredPegawai = useMemo(() => {
    if (!search.trim()) return pegawai;

    return pegawai.filter((p) => {
      const key = search.toLowerCase();
      return (
        p.nama.toLowerCase().includes(key) ||
        p.nip.toLowerCase().includes(key) ||
        p.pangkat_golongan.toLowerCase().includes(key) ||
        p.jabatan_instansi.toLowerCase().includes(key)
      );
    });
  }, [search, pegawai]);

  // =============================
  // EDIT
  // =============================
  const handleEdit = (p: Pegawai) => {
    setSelectedPegawai(p);
    setIsEditing(true);
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return;

    try {
      await apiClient.delete(API_ENDPOINTS.PEGAWAI_BY_ID(id));
      alert("🗑️ Data pegawai berhasil dihapus!");
      fetchPegawai();
    } catch (err) {
      console.error("❌ handleDelete error:", err);
      alert("❌ Gagal menghapus data pegawai.");
    }
  };

  // =============================
  // UPDATE
  // =============================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPegawai) return;

    try {
      await apiClient.put(
        API_ENDPOINTS.PEGAWAI_BY_ID(selectedPegawai.id),
        selectedPegawai
      );

      alert("✅ Data pegawai berhasil diperbarui!");
      setIsEditing(false);
      setSelectedPegawai(null);
      fetchPegawai();
    } catch (err) {
      console.error("❌ handleUpdate error:", err);
      alert("❌ Gagal memperbarui data pegawai.");
    }
  };

  return (
    <div className="space-y-8 text-neutral-800 p-6">
      {/* HEADER */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#5c7a54] mb-2">Data Pegawai</h2>
          <p className="text-neutral-500">Kelola seluruh data pegawai di lingkungan instansi.</p>
        </div>

        <button
          onClick={() => router.push("/pegawai/tambah")}
          className="flex items-center gap-2 bg-[#5c7a54] hover:bg-[#4a6344] text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Tambah Pegawai
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden text-neutral-800">
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-700">Daftar Pegawai</h3>

          {/* SEARCH BAR */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, NIP, jabatan..."
              className="w-full border border-neutral-300 rounded-lg pl-10 pr-3 py-2.5 text-sm 
              focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-neutral-800">
            <thead className="bg-neutral-50 text-neutral-600 font-medium border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Tanggal Lahir</th>
                <th className="px-6 py-4">NIP</th>
                <th className="px-6 py-4">Pangkat / Golongan</th>
                <th className="px-6 py-4">Jabatan / Instansi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredPegawai.length > 0 ? (
                filteredPegawai.map((p, i) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-center">{i + 1}</td>
                    <td className="px-6 py-4 font-medium">{p.nama}</td>
                    <td className="px-6 py-4">{p.tanggal_lahir}</td>
                    <td className="px-6 py-4">{p.nip}</td>
                    <td className="px-6 py-4">{p.pangkat_golongan}</td>
                    <td className="px-6 py-4">{p.jabatan_instansi}</td>

                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition border border-yellow-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-neutral-500 italic">
                    Tidak ada data pegawai ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isEditing && selectedPegawai && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-neutral-200">

            {/* CLOSE */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-[#5c7a54] mb-6 text-center">
              Edit Data Pegawai
            </h3>

            {/* FORM EDIT */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={selectedPegawai.nama}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, nama: e.target.value })
                  }
                  required
                  className="w-full border border-neutral-300 rounded-lg p-2.5 
                  focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] 
                  outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={selectedPegawai.tanggal_lahir}
                  onChange={(e) =>
                    setSelectedPegawai({
                      ...selectedPegawai,
                      tanggal_lahir: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-neutral-300 rounded-lg p-2.5 
                  focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] 
                  outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  NIP
                </label>
                <input
                  type="text"
                  value={selectedPegawai.nip}
                  onChange={(e) =>
                    setSelectedPegawai({ ...selectedPegawai, nip: e.target.value })
                  }
                  required
                  className="w-full border border-neutral-300 rounded-lg p-2.5 
                  focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] 
                  outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Pangkat / Golongan
                </label>
                <select
                  value={selectedPegawai.pangkat_golongan}
                  onChange={(e) =>
                    setSelectedPegawai({
                      ...selectedPegawai,
                      pangkat_golongan: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-neutral-300 rounded-lg p-2.5 
                  focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] 
                  outline-none transition"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Jabatan / Instansi
                </label>
                <input
                  type="text"
                  value={selectedPegawai.jabatan_instansi}
                  onChange={(e) =>
                    setSelectedPegawai({
                      ...selectedPegawai,
                      jabatan_instansi: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-neutral-300 rounded-lg p-2.5 
                  focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] 
                  outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-5 py-2.5 rounded-lg transition font-medium"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#5c7a54] hover:bg-[#4a6344] text-white px-5 py-2.5 rounded-lg shadow-sm transition font-medium"
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
