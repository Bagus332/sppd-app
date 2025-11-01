// frontend/app/components/SuratTugasForm.tsx (Perubahan untuk Multi-Pegawai)

'use client';

import { useState } from 'react';
// Import useFieldArray, SubmitHandler
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'; 
import { Plus, X } from 'lucide-react'; // Asumsi lucide-react sudah terinstal
import { useRouter } from 'next/navigation';

// --- Tipe Data Pegawai ---
interface EmployeeData {
  nama_pegawai: string;
  nip_pegawai: string;
  pangkat_gol: string;
  jabatan_pegawai: string;
}

// --- Tipe Data Form Utama ---
interface SuratTugasFormData {
  nomor: string;
  menimbang_kegiatan: string;
  dasar_dipa: string;
  dasar_dipa_tanggal: string;
  tujuan_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tanggal_surat: string;
  nama_dekan: string;
  // Perubahan: Menggunakan array untuk daftar pegawai
  pegawai_list: EmployeeData[]; 
}

// --- Komponen Utama ---
export default function SuratTugasForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<SuratTugasFormData>({
      defaultValues: {
        tanggal_surat: new Date().toISOString().substring(0, 10),
        // Pegawai pertama default, minimal 1 pegawai
        pegawai_list: [{ nama_pegawai: '', nip_pegawai: '', pangkat_gol: '', jabatan_pegawai: '' }] 
      }
  });

  // Hook untuk mengelola array form dinamis
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pegawai_list",
  });

  const onSubmit: SubmitHandler<SuratTugasFormData> = async (data) => {
    setSubmitStatus('idle');

    if (data.pegawai_list.length === 0) {
        alert("Minimal harus ada satu pegawai yang ditugaskan.");
        return;
    }
    
    // Validasi tambahan: Pastikan tidak ada pegawai yang memiliki field wajib kosong
    const invalidPegawai = data.pegawai_list.some(p => !p.nama_pegawai || !p.nip_pegawai);
    if (invalidPegawai) {
        setSubmitStatus('error');
        // Pesan error di form validation akan muncul otomatis karena 'required: true'
        return;
    }

    try {
      setIsSubmitting(true);
      // Endpoint Express.js di port 8080
      const response = await fetch('http://localhost:8080/api/surat/buat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mengirim data array pegawai ke backend
        body: JSON.stringify(data), 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Gagal membuat surat tugas');
      }

      // Handle successful submission - download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Mengambil nama file dari header Content-Disposition (jika ada)
      const disposition = response.headers.get('content-disposition');
      let filename = `Surat_Tugas_${data.nomor}.docx`;
       if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename="?(.+?)"?($|;)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
          }
      }
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSubmitStatus('success');
      reset(); // Reset form setelah sukses
      // router.push('/riwayat-surat'); // Redirect opsional
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error: any) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFieldsGeneral = [
    { label: "Nomor Surat", name: "nomor", type: "text" as const, required: true, span: 1 },
    { label: "Dasar DIPA", name: "dasar_dipa", type: "text" as const, required: false, span: 1 },
    { label: "Tanggal DIPA", name: "dasar_dipa_tanggal", type: "date" as const, required: false, span: 1 },
    { label: "Tanggal Surat Dibuat", name: "tanggal_surat", type: "date" as const, required: true, span: 1 },
    { label: "Nama Dekan (Tanda Tangan)", name: "nama_dekan", type: "text" as const, required: true, span: 2 },
    { label: "Menimbang (Kegiatan)", name: "menimbang_kegiatan", type: "textarea" as const, required: true, span: 3 },
    { label: "Tujuan Kegiatan (Rincian Tugas)", name: "tujuan_kegiatan", type: "textarea" as const, required: true, span: 3 },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-8 space-y-8 bg-neutral-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-300">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">Data Surat Tugas</h2>
        <p className="text-sm text-neutral-600">Informasi administrasi dan penugasan utama.</p>
      </div>

      {/* --- FORM UTAMA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formFieldsGeneral.map((field) => (
          <div className={`space-y-2 ${field.span === 3 ? 'md:col-span-3' : field.span === 2 ? 'md:col-span-2' : ''}`} key={field.name}>
            <label className="block text-sm font-medium text-neutral-600">
              {field.label} {field.required && <span className="text-[#c66756]">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                {...register(field.name as keyof SuratTugasFormData, { required: field.required })}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                rows={field.name === 'menimbang_kegiatan' ? 2 : 3}
              />
            ) : (
              <input
                type={field.type}
                {...register(field.name as keyof SuratTugasFormData, { required: field.required })}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
              />
            )}
            {errors[field.name as keyof SuratTugasFormData] && <p className="text-[#c66756] text-xs mt-1">Field wajib diisi.</p>}
          </div>
        ))}
        {/* --- Tanggal Perjalanan Dinas --- */}
        <div className="grid grid-cols-2 gap-4 md:col-span-3">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tanggal Mulai <span className="text-[#c66756]">*</span></label>
                <input
                    type="date"
                    {...register("tanggal_mulai", { required: true })}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                />
            </div>
             <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tanggal Selesai <span className="text-[#c66756]">*</span></label>
                <input
                    type="date"
                    {...register("tanggal_selesai", { required: true })}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                />
            </div>
        </div>
      </div>
      
      {/* --- FORM PEGAWAI DINAMIS (Halaman 2) --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-t border-neutral-300 pt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] bg-clip-text text-transparent">Daftar Pegawai ({fields.length})</h2>
            <button
                type="button"
                onClick={() => append({ nama_pegawai: '', nip_pegawai: '', pangkat_gol: '', jabatan_pegawai: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5c7a54] rounded-lg shadow-sm hover:bg-[#485f41] transition-all duration-200"
            >
                <Plus className="h-4 w-4" /> Tambah Pegawai
            </button>
        </div>
        <p className="text-sm text-neutral-600">Tambahkan data pegawai yang akan ditugaskan. (Untuk output Page 2)</p>

        <div className="space-y-6">
            {fields.map((item, index) => (
                <div key={item.id} className="p-6 bg-white rounded-lg shadow-md border border-neutral-200 relative">
                    <h3 className="text-lg font-semibold mb-4 text-[#c66756]">Pegawai #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-600">Nama <span className="text-[#c66756]">*</span></label>
                            <input
                                type="text"
                                {...register(`pegawai_list.${index}.nama_pegawai`, { required: true })}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-600">NIP <span className="text-[#c66756]">*</span></label>
                            <input
                                type="text"
                                {...register(`pegawai_list.${index}.nip_pegawai`, { required: true })}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-600">Pangkat/Gol</label>
                            <input
                                type="text"
                                {...register(`pegawai_list.${index}.pangkat_gol`)}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-600">Jabatan</label>
                            <input
                                type="text"
                                {...register(`pegawai_list.${index}.jabatan_pegawai`)}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5c7a54] focus:border-[#5c7a54] transition-all duration-200 text-neutral-900"
                            />
                        </div>
                    </div>
                    {fields.length > 1 && (
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 p-1.5 text-[#c66756] bg-transparent rounded-full hover:bg-neutral-200 transition-all duration-200"
                            title="Hapus Pegawai"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
      </div>
      
      {/* --- STATUS DAN SUBMIT --- */}
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
        {/* Status Messages */}
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