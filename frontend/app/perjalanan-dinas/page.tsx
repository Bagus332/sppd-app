// frontend/app/perjalanan-dinas/page.tsx
'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import PerjalananDinas from '@/app/components/PerjalananDinas';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Tambahan untuk ikon tombol kembali

export default function PerjalananDinasPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika butuh proteksi login
    if (!isAuthenticated) {
      router.replace('/login'); 
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigasi */}
      <Header />

      {/* Konten Utama */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            {/* Tombol Kembali - Ditambahkan di sini, di atas komponen PerjalananDinas */}
            <div className="mb-6">
              <button
                onClick={() => router.back()} // Kembali ke halaman sebelumnya
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                title="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>
            </div>

            <PerjalananDinas />
          </div>
        </div>
      </main>
    </div>
  );
}
