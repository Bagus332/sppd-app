// frontend/app/daftar-surat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { FileText, Trash2, Eye, ArrowLeft, FileDown } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

interface Surat {
  id: number;
  nomor: string;
  spd_nomor: string; // Pastikan field ini ada
  nama_pegawai: string; // Atau ambil dari array pegawai_list[0]
  tujuan_kegiatan: string;
  maksud_dinas: string;
  tanggal_mulai: string;
  tgl_berangkat: string;
  tanggal_selesai: string;
  tgl_kembali: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pegawai_list: any[];
}

export default function DaftarSurat() {
  const [surats, setSurats] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<number | null>(null); // State untuk loading download
  const router = useRouter();

  useEffect(() => {
    fetchSurats();
  }, []);

  const fetchSurats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Surat[]>(API_ENDPOINTS.SURAT);
      setSurats(data || []);
    } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Generik untuk Download File
  const handleDownload = async (id: number, type: 'tugas' | 'spd') => {
    try {
      setDownloading(id);
      
      const blob = await apiClient.downloadFile(`/api/surat/${id}/download/${type}`);

      // Proses Blob untuk download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Ambil nama file dari header jika ada, atau default
      // Note: apiClient.downloadFile returns a Blob, headers are not directly accessible here easily unless we change downloadFile to return response.
      // However, for now let's use a default name or try to improve downloadFile later.
      // But wait, the previous code used response.headers.
      // Let's stick to a simple filename for now or assume the user is okay with default names if we can't get headers.
      // Actually, let's just use a hardcoded name based on type for simplicity as apiClient hides the response.
      let filename = type === 'tugas' ? 'Surat_Tugas.docx' : 'SPD.docx';
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error(err);
      alert(`Gagal mengunduh ${type === 'tugas' ? 'Surat Tugas' : 'SPD'}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus surat ini?')) return;
    try {
      await apiClient.delete(API_ENDPOINTS.SURAT_BY_ID(id));
      setSurats(surats.filter(s => s.id !== id));
    } catch (err) {
      alert('Gagal menghapus surat');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Helper untuk menampilkan nama pegawai (jika array)
  const getNamaPegawai = (surat: Surat) => {
    if (surat.pegawai_list && surat.pegawai_list.length > 0) {
        if (surat.pegawai_list.length === 1) {
            return surat.pegawai_list[0].nama_pegawai;
        } else {
            return `${surat.pegawai_list[0].nama_pegawai} (+${surat.pegawai_list.length - 1} Lainnya)`;
        }
    }
    return '-';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-10">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl font-bold mb-2">Daftar Surat Tugas & SPD</h1>
          <p className="text-blue-100">Kelola dan unduh dokumen perjalanan dinas</p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && surats.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md pb-4">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">No. Surat</th>
                  <th className="px-6 py-4 text-left font-semibold">Pegawai</th>
                  <th className="px-6 py-4 text-left font-semibold">Tujuan</th>
                  <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-center font-semibold">Download</th>
                  <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {surats.map((surat) => (
                  <tr key={surat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                        <div>{surat.nomor}</div>
                        <div className="text-xs text-gray-400 mt-1">{surat.spd_nomor}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        {getNamaPegawai(surat)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm max-w-xs truncate">
                        {surat.maksud_dinas || surat.tujuan_kegiatan}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {formatDate(surat.tgl_berangkat || surat.tanggal_mulai)} s.d <br/>
                      {formatDate(surat.tgl_kembali || surat.tanggal_selesai)}
                    </td>
                    
                    {/* Kolom Tombol Generate/Download */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          onClick={() => handleDownload(surat.id, 'tugas')}
                          disabled={downloading === surat.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold transition-colors w-full justify-center border border-blue-200"
                        >
                           {downloading === surat.id ? (
                             <span className="animate-spin h-3 w-3 border-2 border-blue-600 rounded-full border-t-transparent"></span>
                           ) : <FileText size={14} />}
                           Surat Tugas
                        </button>
                        <button
                          onClick={() => handleDownload(surat.id, 'spd')}
                          disabled={downloading === surat.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded text-xs font-semibold transition-colors w-full justify-center border border-orange-200"
                        >
                           {downloading === surat.id ? (
                             <span className="animate-spin h-3 w-3 border-2 border-orange-600 rounded-full border-t-transparent"></span>
                           ) : <FileDown size={14} />}
                           SPD
                        </button>
                      </div>
                    </td>

                    {/* Kolom Aksi (Hapus/Lihat) */}
                    <td className="px-6 py-4 text-center">
                       <div className="flex justify-center gap-2">
                        <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Lihat Detail"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(surat.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Hapus"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
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