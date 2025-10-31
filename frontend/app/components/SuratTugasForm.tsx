'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SuratTugasFormData {
  nomor: string;
  menimbang_kegiatan: string;
  dasar_dipa: string;
  dasar_dipa_tanggal: string;
  nama_pegawai: string;
  nip_pegawai: string;
  pangkat_gol: string;
  jabatan_pegawai: string;
  tujuan_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tanggal_surat: string;
  nama_dekan: string;
}

export default function SuratTugasForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SuratTugasFormData>();

  const onSubmit = async (data: SuratTugasFormData) => {
    setSubmitStatus('idle');
    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:8080/api/surat/buat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create surat tugas');
      }

      // Handle successful submission - download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Surat_Tugas_${data.nomor}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-8 space-y-8 bg-neutral-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-300">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">Form Surat Tugas</h2>
          <span className="px-3 py-1.5 text-sm font-medium text-[#c66756] bg-[#c66756]/10 rounded-lg border border-[#c66756]/20">
            Wajib Diisi*
          </span>
        </div>
        <p className="text-sm text-neutral-600">Silakan isi formulir berikut untuk membuat surat tugas baru</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Nomor Surat <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="text"
            {...register("nomor", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 invalid:border-[#c66756] invalid:focus:ring-[#c66756] text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Menimbang (Kegiatan) <span className="text-[#c66756]">*</span>
          </label>
          <textarea
            {...register("menimbang_kegiatan", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Dasar DIPA
          </label>
          <input
            type="text"
            {...register("dasar_dipa")}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Tanggal DIPA
          </label>
          <input
            type="date"
            {...register("dasar_dipa_tanggal")}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-600">
            Nama Pegawai <span className="text-[#c66756]">*</span>
          </label>
          <input
            type="text"
            {...register("nama_pegawai", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            NIP Pegawai
          </label>
          <input
            type="text"
            {...register("nip_pegawai", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pangkat/Golongan
          </label>
          <input
            type="text"
            {...register("pangkat_gol")}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Jabatan
          </label>
          <input
            type="text"
            {...register("jabatan_pegawai")}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tujuan Kegiatan
          </label>
          <textarea
            {...register("tujuan_kegiatan", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Mulai
          </label>
          <input
            type="date"
            {...register("tanggal_mulai", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
          {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Selesai
          </label>
          <input
            type="date"
            {...register("tanggal_selesai", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
          {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Surat
          </label>
          <input
            type="date"
            {...register("tanggal_surat", { required: true })}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
          {errors.tanggal_surat && <p className="text-red-500 text-sm">{errors.tanggal_surat.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nama Dekan
          </label>
          <input
            type="text"
            {...register("nama_dekan")}
            className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        <div className="flex items-center justify-end w-full gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 text-sm font-medium text-[#c66756] bg-[#c66756]/10 rounded-lg hover:bg-[#c66756]/20 focus:outline-none focus:ring-2 focus:ring-[#c66756] transition-all duration-200"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] text-white rounded-lg shadow-lg hover:from-[#485f41] hover:to-[#5c7a54] focus:outline-none focus:ring-2 focus:ring-[#5c7a54] disabled:from-[#7b9674] disabled:to-[#6b8563] transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Buat Surat Tugas</span>
              </>
            )}
          </button>
        </div>
        {submitStatus === 'success' && (
          <div className="w-full bg-[#5c7a54]/10 backdrop-blur-sm p-4 rounded-xl border border-[#5c7a54]/20 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#5c7a54]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#5c7a54]">
                  Surat tugas berhasil dibuat dan diunduh!
                </p>
              </div>
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="w-full bg-[#c66756]/10 backdrop-blur-sm p-4 rounded-xl border border-[#c66756]/20 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#c66756]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#c66756]">
                  Terjadi kesalahan saat membuat surat tugas. Silakan coba lagi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}