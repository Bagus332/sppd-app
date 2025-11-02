'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard SPPD</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => router.push('/surat-tugas/buat')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Buat Surat Tugas</h2>
          <p className="text-gray-600">Buat surat tugas baru untuk perjalanan dinas</p>
        </div>

        <div 
          onClick={() => router.push('/spd/buat')}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Buat SPD</h2>
          <p className="text-gray-600">Buat Surat Perjalanan Dinas (SPD) baru</p>
        </div>
      </div>
    </div>
  );
}