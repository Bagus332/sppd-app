'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import SuratTugasForm from './components/SuratTugasForm';
import Header from './components/Header';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-10">
        <header className="mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Sistem Pembuatan Surat Tugas
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Buat dan kelola surat tugas dengan mudah dan cepat. Isi form di bawah untuk membuat surat tugas baru.
              </p>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-3 text-base font-semibold leading-6 text-gray-900">Form Surat Tugas</span>
                </div>
              </div>
              <div className="mt-8">
                <SuratTugasForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
