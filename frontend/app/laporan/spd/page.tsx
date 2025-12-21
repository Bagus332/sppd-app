'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, FileDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SPD {
  id: number;
  spd_nomor: string;
  ppk_name: string;
  tempat_tujuan: string;
  tgl_berangkat: string;
  tgl_kembali: string;
  lama_hari: number;
}

export default function LaporanSPD() {
  const router = useRouter();
  const [data, setData] = useState<SPD[]>([]);
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (from?: string, to?: string) => {
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      let url = `${baseUrl}/laporan/spd`;
      const params = new URLSearchParams();
      if (from) params.append('dari', from);
      if (to) params.append('sampai', to);
      const qs = params.toString();
      if (qs) url += `?${qs}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => fetchData(dari, sampai);

  const handleExport = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    let url = `${baseUrl}/laporan/spd/export`;
    const params = new URLSearchParams();
    if (dari) params.append('dari', dari);
    if (sampai) params.append('sampai', sampai);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
    window.open(url);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-6">

        {/* Tombol Kembali */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        {/* Header */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#5c7a54]">Laporan SPD</h1>
          <p className="text-neutral-500">
            Rekap data perjalanan dinas berdasarkan rentang tanggal
          </p>

          {/* Filter */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <input
              type="date"
              value={dari}
              onChange={(e) => setDari(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5c7a54]"
            />
            <input
              type="date"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5c7a54]"
            />
            <button
              onClick={handleFilter}
              className="bg-[#5c7a54] hover:bg-[#4f6b48] text-white px-4 py-2 rounded shadow text-sm"
            >
              Saring
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2 text-sm"
            >
              <FileDown size={16} />
              Cetak Excel
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c7a54]"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {/* Table */}
        {!loading && data.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-neutral-200 pb-4">
            <table className="w-full">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Nomor SPD</th>
                  <th className="px-6 py-4 text-left font-semibold">Pegawai Pembuat Komitmen</th>
                  <th className="px-6 py-4 text-left font-semibold">Tujuan</th>
                  <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left font-semibold">Durasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {row.spd_nomor}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {row.ppk_name}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {row.tempat_tujuan}
                    </td>
                    <td className="px-6 py-4 text-neutral-700 text-sm">
                      {formatDate(row.tgl_berangkat)} s.d <br />
                      {formatDate(row.tgl_kembali)}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {row.lama_hari} hari
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center text-neutral-400 py-12 bg-white rounded-xl border">
            Tidak ada data SPD
          </div>
        )}
      </main>
    </div>
  );
}
