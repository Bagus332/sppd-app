'use client';

import { useEffect, useState } from 'react';

interface SPD {
  id: number;
  spd_nomor: string;
  ppk_name: string;
  tempat_tujuan: string;
  tgl_berangkat: string;
  tgl_kembali: string;
}

export default function LaporanSPD() {
  const [data, setData] = useState<SPD[]>([]);
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (from?: string, to?: string) => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:8080/laporan/spd'; // pakai host lengkap
      if (from && to) url += `?dari=${from}&sampai=${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      console.error(err);
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
    let url = 'http://localhost:8080/laporan/spd/export';
    if (dari && sampai) url += `?dari=${dari}&sampai=${sampai}`;
    window.open(url);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Laporan SPD</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input type="date" value={dari} onChange={e => setDari(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="date" value={sampai} onChange={e => setSampai(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">Saring</button>
        <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">Cetak Excel</button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Preview Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 pb-4">
          <table className="min-w-full">
            <thead className="bg-orange-100 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Nomor SPD</th>
                <th className="px-6 py-3 text-left font-semibold">Pejabat Pembuat Komitmen</th>
                <th className="px-6 py-3 text-left font-semibold">Tujuan</th>
                <th className="px-6 py-3 text-left font-semibold">Tanggal Berangkat</th>
                <th className="px-6 py-3 text-left font-semibold">Tanggal Kembali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length > 0 ? data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">{row.spd_nomor}</td>
                  <td className="px-6 py-3">{row.ppk_name}</td>
                  <td className="px-6 py-3">{row.tempat_tujuan}</td>
                  <td className="px-6 py-3">{formatDate(row.tgl_berangkat)}</td>
                  <td className="px-6 py-3">{formatDate(row.tgl_kembali)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-3 text-center text-gray-400">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
