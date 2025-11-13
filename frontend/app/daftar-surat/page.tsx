'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { FileText, Download, Trash2, Eye } from 'lucide-react';

interface Surat {
  id: number;
  nomor: string;
  nama_pegawai: string;
  tujuan_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  createdAt: string;
}

export default function DaftarSurat() {
  const [surats, setSurats] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurats();
  }, []);

  const fetchSurats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/surat', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data surat');
      }

      const data = await response.json();
      setSurats(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat mengambil data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus surat ini?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/surat/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus surat');
      }

      setSurats(surats.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Gagal menghapus surat');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl font-bold mb-2">Daftar Surat Tugas & SPD</h1>
          <p className="text-blue-100">Kelola semua surat yang telah dibuat</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && surats.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada surat yang dibuat</p>
            <p className="text-gray-400">Mulai dengan membuat perjalanan dinas baru</p>
          </div>
        )}

        {/* Table */}
        {!loading && surats.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">No. Surat</th>
                  <th className="px-6 py-4 text-left font-semibold">Nama Pegawai</th>
                  <th className="px-6 py-4 text-left font-semibold">Tujuan Kegiatan</th>
                  <th className="px-6 py-4 text-left font-semibold">Tanggal Mulai</th>
                  <th className="px-6 py-4 text-left font-semibold">Tanggal Selesai</th>
                  <th className="px-6 py-4 text-left font-semibold">Dibuat Tanggal</th>
                  <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {surats.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{surat.nomor}</td>
                    <td className="px-6 py-4 text-gray-700">{surat.nama_pegawai}</td>
                    <td className="px-6 py-4 text-gray-700">{surat.tujuan_kegiatan}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(surat.tanggal_mulai)}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(surat.tanggal_selesai)}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(surat.createdAt)}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(surat.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}