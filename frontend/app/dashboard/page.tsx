'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useAuth } from "../contexts/AuthContext";
import { FileText, Users, FolderOpen, BarChart3, Plane } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();

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

  const stats = [
    { label: 'Total Perjalanan Dinas', value: 124, color: 'text-green-600' },
    { label: 'Total SPD', value: 87, color: 'text-emerald-600' },
    { label: 'Data Pegawai', value: 42, color: 'text-lime-600' },
    { label: 'Surat Selesai', value: 93, color: 'text-teal-600' },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 text-center border border-gray-100"
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
