'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from 'react';
import { Users, FolderOpen, BarChart3, Plane } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

  // 🔥 State untuk data statistik (dinamis dari backend)
  const [totalPerjalanan, setTotalPerjalanan] = useState(0);
  const [totalSPD, setTotalSPD] = useState(0);
  const [totalPegawai, setTotalPegawai] = useState(0);
  const [totalSelesai, setTotalSelesai] = useState(0);

  // 🔥 Ambil data dari backend (contoh untuk perjalanan)
  useEffect(() => {
    fetch("http://localhost:8080/api/perjalanan/count")
      .then((res) => res.json())
      .then((data) => setTotalPerjalanan(data.total))
      .catch((err) => console.error("Error fetch perjalanan:", err));

    fetch("http://localhost:8080/api/pegawai/count/all")
      .then((res) => res.json())
      .then((data) => setTotalPegawai(data.total))
      .catch((err) => console.error("Error fetch pegawai:", err));
  }, []);

  const menuItems = [
    {
      title: 'Buat Perjalanan Dinas',
      description: 'Isi form gabungan untuk membuat Surat Tugas dan SPD sekaligus.',
      icon: <Plane size={40} className="text-green-500" />,
      action: () => router.push('/perjalanan-dinas'),
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Data Pegawai',
      description: 'Lihat dan kelola data pegawai yang tersedia.',
      icon: <Users size={40} className="text-lime-500" />,
      action: () => router.push('/pegawai'),
      gradient: 'from-lime-500 to-green-500',
    },
    {
      title: 'Daftar Surat',
      description: 'Lihat daftar seluruh surat tugas dan SPD yang telah dibuat.',
      icon: <FolderOpen size={40} className="text-teal-500" />,
      action: () => router.push('/daftar-surat'),
      gradient: 'from-teal-500 to-green-500',
    },
  ];

  // 🔥 Ganti value stat menjadi dari state, bukan angka statis
  const stats = [
  { label: 'Total Perjalanan Dinas', value: totalPerjalanan, color: 'text-green-600' },
  { label: 'Data Pegawai', value: totalPegawai, color: 'text-lime-600' },
];


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-10">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard SPPD</h1>
          <p className="text-green-100 text-sm">
            Sistem Pembuatan Surat Perjalanan Dinas Terpadu
          </p>
        </div>

        {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 px-2 w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 text-center border border-gray-300"
          >
            <BarChart3 size={28} className={`${stat.color} mx-auto mb-3`} />
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>


        {/* Menu Interaktif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${item.gradient} rounded-2xl`}
              ></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-4">{item.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
