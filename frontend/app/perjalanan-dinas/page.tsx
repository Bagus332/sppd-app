// frontend/app/perjalanan-dinas/page.tsx
'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import PerjalananDinas from '@/app/components/PerjalananDinas';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
            <PerjalananDinas />
          </div>
        </div>
      </main>
    </div>
  );
}
