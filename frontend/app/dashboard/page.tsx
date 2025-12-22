'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChartIcon, PersonIcon, FileTextIcon, RocketIcon, PlusIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

interface DashboardStats {
  totalPerjalanan: number;
  totalSPD: number;
  totalPegawai: number;
  suratSelesai: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerjalanan: 0,
    totalSPD: 0,
    totalPegawai: 0,
    suratSelesai: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(API_ENDPOINTS.DASHBOARD_STATS);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // If unauthorized, the interceptor or logic in apiClient/middleware should handle it,
        // but we can doubly ensure here:
        if ((error as Error).message.includes('Unauthorized') || (error as Error).message.includes('401')) {
           router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const statsDisplay = [
    { 
      label: 'Total Perjalanan Dinas', 
      value: stats.totalPerjalanan, 
      icon: RocketIcon,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    { 
      label: 'Total SPD', 
      value: stats.totalSPD, 
      icon: FileTextIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { 
      label: 'Data Pegawai', 
      value: stats.totalPegawai, 
      icon: PersonIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    { 
      label: 'Surat Selesai', 
      value: stats.suratSelesai, 
      icon: BarChartIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
  ];

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50/50 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-muted-foreground text-gray-500">
          Selamat datang di Sistem Perjalanan Dinas. Berikut adalah ringkasan aktivitas terkini.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((stat, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={stats} />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Akses cepat ke fitur utama</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/perjalanan-dinas" className="flex items-center p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors group">
                <div className="p-2 bg-white rounded-full mr-4 shadow-sm group-hover:shadow">
                    <PlusIcon className="w-5 h-5" />
                </div>
                <div>
                    <div className="font-semibold">Buat Surat Baru</div>
                    <div className="text-xs text-green-600/80">Input perjalanan dinas & SPD</div>
                </div>
            </Link>
            <Link href="/daftar-surat" className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group">
                <div className="p-2 bg-white rounded-full mr-4 shadow-sm group-hover:shadow">
                    <ArchiveIcon className="w-5 h-5" />
                </div>
                <div>
                    <div className="font-semibold">Arsip Surat</div>
                    <div className="text-xs text-blue-600/80">Lihat riwayat surat tugas</div>
                </div>
            </Link>
            <Link href="/pegawai" className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors group">
                <div className="p-2 bg-white rounded-full mr-4 shadow-sm group-hover:shadow">
                    <PersonIcon className="w-5 h-5" />
                </div>
                <div>
                    <div className="font-semibold">Data Pegawai</div>
                    <div className="text-xs text-purple-600/80">Kelola data pegawai</div>
                </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
