// sppd-frontend/pages/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan (redirect) pengguna langsung ke halaman input-surat
    router.push('/input-surat');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-700">Mengalihkan ke formulir Input Surat Tugas...</p>
    </div>
  );
}