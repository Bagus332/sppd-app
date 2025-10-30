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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Surat Tugas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nomor Surat
          </label>
          <input
            type="text"
            {...register("nomor", { required: "Nomor surat wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nomor && <p className="text-red-500 text-sm">{errors.nomor.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Menimbang (Kegiatan)
          </label>
          <textarea
            {...register("menimbang_kegiatan", { required: "Kegiatan wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {errors.menimbang_kegiatan && <p className="text-red-500 text-sm">{errors.menimbang_kegiatan.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dasar DIPA
          </label>
          <input
            type="text"
            {...register("dasar_dipa")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal DIPA
          </label>
          <input
            type="date"
            {...register("dasar_dipa_tanggal")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nama Pegawai
          </label>
          <input
            type="text"
            {...register("nama_pegawai", { required: "Nama pegawai wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nama_pegawai && <p className="text-red-500 text-sm">{errors.nama_pegawai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            NIP Pegawai
          </label>
          <input
            type="text"
            {...register("nip_pegawai", { required: "NIP pegawai wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nip_pegawai && <p className="text-red-500 text-sm">{errors.nip_pegawai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pangkat/Golongan
          </label>
          <input
            type="text"
            {...register("pangkat_gol")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Jabatan
          </label>
          <input
            type="text"
            {...register("jabatan_pegawai")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tujuan Kegiatan
          </label>
          <textarea
            {...register("tujuan_kegiatan", { required: "Tujuan kegiatan wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {errors.tujuan_kegiatan && <p className="text-red-500 text-sm">{errors.tujuan_kegiatan.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Mulai
          </label>
          <input
            type="date"
            {...register("tanggal_mulai", { required: "Tanggal mulai wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Selesai
          </label>
          <input
            type="date"
            {...register("tanggal_selesai", { required: "Tanggal selesai wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Surat
          </label>
          <input
            type="date"
            {...register("tanggal_surat", { required: "Tanggal surat wajib diisi" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        {submitStatus === 'success' && (
          <div className="w-full bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Surat tugas berhasil dibuat dan diunduh!
                </p>
              </div>
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="w-full bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Terjadi kesalahan saat membuat surat tugas. Silakan coba lagi.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors duration-200 ease-in-out flex items-center justify-center gap-2"
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
    </form>
  );
}