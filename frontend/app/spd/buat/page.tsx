'use client';

import Header from '@/app/components/Header';
//import SPDForm from '@/app//components/SPDForm';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SPDPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Middleware ini mem-bypass middleware.ts
      if (!isAuthenticated) {
        // router.replace('/login');
        // Jika perlu otentikasi
        // return;
      }
    }, [isAuthenticated, router]);
    
    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="py-10">
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                  <SPDForm />
                </div>
              </div>
            </main>
          </div>
        </div>
    );
}