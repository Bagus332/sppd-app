'use client';

import SuratTugasForm from '@/app/components/SuratTugasForm';

export default function BuatSuratTugas() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Buat Surat Tugas</h1>
      <SuratTugasForm />
    </div>
  );
}