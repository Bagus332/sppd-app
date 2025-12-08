"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import PerjalananDinas, { FormSuratGabunganData } from '@/app/components/PerjalananDinas';

export default function EditSuratPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<FormSuratGabunganData | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<FormSuratGabunganData>(API_ENDPOINTS.SURAT_BY_ID(Number(id)));
        setInitialData(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-2xl font-bold mb-2 text-[#5c7a54]">Edit Surat</h1>
          <p className="text-neutral-500">Ubah detail surat dan simpan perubahan.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c7a54]"></div>
          </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              Error: {error}
           </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
             <PerjalananDinas initialData={initialData} isEdit={true} />
          </div>
        )}
      </main>
    </div>
  );
}
