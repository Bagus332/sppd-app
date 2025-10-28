// pages/dashboard.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurat = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/surat');
        setSuratList(res.data);
      } catch (error) {
        console.error('Gagal mengambil data surat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurat();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - SPPD Otomatis</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Surat Tugas</h1>
          <Link href="/input-surat">
            <a className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              + Buat Surat Baru
            </a>
          </Link>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Daftar Surat yang Sudah Dibuat</h2>
          {loading ? (
            <p>Memuat data...</p>
          ) : suratList.length === 0 ? (
            <p>Belum ada Surat Tugas yang dibuat.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {suratList.map((surat) => (
                <li key={surat.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{surat.nomor}</p>
                    <p className="text-sm text-gray-500">
                      Tugas untuk: {surat.nama_pegawai} | Tujuan: {surat.tujuan_kegiatan.substring(0, 50)}...
                    </p>
                  </div>
                  <Link href={`/surat/${surat.id}`}>
                    <a className="text-indigo-600 hover:text-indigo-900 font-medium">
                      Lihat Detail
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}