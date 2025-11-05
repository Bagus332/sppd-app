'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // tambahkan ini

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth(); // ambil fungsi logout dari context

  useEffect(() => {
    if (!router) {
      console.error("Router belum siap");
    }
  }, [router]);

  const handleLogout = async () => {
    console.log("Logout diklik");

    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;

    try {
      await logout(); // panggil logout dari context (ini yang penting)
      console.log("Berhasil logout, diarahkan ke halaman login...");
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Terjadi kesalahan saat logout, silakan coba lagi.");
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">
              SPPD
            </span>
            <div className="hidden space-x-8 lg:flex items-center">
              <a
                href="#"
                className="text-sm font-medium text-neutral-700 hover:text-[#5c7a54] transition-colors duration-200"
              >
                Riwayat Surat
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-700 hover:text-[#5c7a54] transition-colors duration-200"
              >
                Panduan
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Administrator
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#c66756] to-[#d17665] rounded-lg shadow-sm hover:from-[#b35647] hover:to-[#c66756] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
