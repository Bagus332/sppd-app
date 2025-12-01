'use client';
import PerjalananDinas from '@/app/components/PerjalananDinas';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PerjalananDinasPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-6">
        
        {/* Tombol Kembali – sama seperti halaman DaftarSurat */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
                       text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        {/* Card Judul */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#5c7a54]">Perjalanan Dinas</h1>
          <p className="text-neutral-500">Kelola data perjalanan dinas pegawai dengan mudah dan terstruktur.</p>
        </div>

        {/* Konten Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <PerjalananDinas />
        </div>

      </main>
    </div>
  );
}
