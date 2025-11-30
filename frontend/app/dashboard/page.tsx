'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useAuth } from "../contexts/AuthContext";
import { FileText, Users, FolderOpen, BarChart3, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient, API_ENDPOINTS } from '../../lib/api-client';

interface DashboardStats {
  totalPerjalanan: number;
  totalSPD: number;
  totalPegawai: number;
  suratSelesai: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerjalanan: 0,
    totalSPD: 0,
    totalPegawai: 0,
    suratSelesai: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if authenticated and auth check is complete
    if (!authLoading && isAuthenticated) {
      fetchDashboardStats();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(
        API_ENDPOINTS.DASHBOARD_STATS
      );
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // If unauthorized, stats will remain at 0
    } finally {
      setLoading(false);
    }
  };

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

  const statsDisplay = [
    { label: 'Total Perjalanan Dinas', value: stats.totalPerjalanan, color: 'text-green-600' },
    { label: 'Total SPD', value: stats.totalSPD, color: 'text-emerald-600' },
    { label: 'Data Pegawai', value: stats.totalPegawai, color: 'text-lime-600' },
    { label: 'Surat Selesai', value: stats.suratSelesai, color: 'text-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg p-8 mb-10">
          <h1 className="text-3xl font-bold mb-2">Dashboard SPPD</h1>
          <p className="text-green-100 text-sm">
            Sistem Pembuatan Surat Perjalanan Dinas Terpadu
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100 animate-pulse"
              >
                <div className="h-7 w-7 bg-gray-200 rounded mx-auto mb-3"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            statsDisplay.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 text-center border border-gray-100"
            >
              <BarChart3 size={28} className={`${stat.color} mx-auto mb-3`} />
              <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          ))
          )}
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
