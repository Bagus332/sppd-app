// frontend/app/components/SPDForm.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'; 
import { Plus, X, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Tipe Data Pengikut (Item 8) ---
interface PengikutData {
  nama: string;
  tgl_lahir: string;
  keterangan: string;
}

// --- Tipe Data Pegawai Utama (Item 2) ---
interface PegawaiUtamaData {
    nama: string;
    nip: string;
}

// --- Tipe Data Form SPD ---
interface SPDFormData {
  spd_nomor: string;
  ppk_name: string;
  pegawai_utama: PegawaiUtamaData;
  pangkat_gol: string;
  jabatan_instansi: string;
  tingkat_biaya: string;
  maksud_dinas: string;
  alat_angkut: string;
  tempat_berangkat: string;
  tempat_tujuan: string;
  lama_hari: number;
  tgl_berangkat: string;
  tgl_kembali: string;
  pengikut_list: PengikutData[]; // Array dinamis untuk pengikut
  ppk_nip: string;
}

// --- Komponen Utama ---
export default function SPDForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<SPDFormData>({
      defaultValues: {
        pegawai_utama: { nama: '', nip: '' },
        pengikut_list: [], // Mulai dengan list kosong
        lama_hari: 1,
      }
  });

  // Hook untuk mengelola array form dinamis Pengikut
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pengikut_list",
  });

  const onSubmit: SubmitHandler<SPDFormData> = async (data) => {
    setSubmitStatus('idle');

    if (data.pengikut_list.length > 0) {
        // Validasi pengikut: Minimal Nama wajib diisi jika ada dalam list
        const invalidPengikut = data.pengikut_list.some(p => !p.nama);
        if (invalidPengikut) {
            setSubmitStatus('error');
            alert("Nama Pengikut wajib diisi.");
            return;
        }
    }
    
    try {
      setIsSubmitting(true);
      
      // Endpoint Express.js untuk SPD
      const response = await fetch('http://localhost:8080/api/surat/spd/buat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mengirim data array pengikut ke backend
        body: JSON.stringify(data), 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Gagal membuat dokumen SPD');
      }

      // Handle successful submission - download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const disposition = response.headers.get('content-disposition');
      let filename = `SPD_${data.spd_nomor}.docx`;
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
      reset(); 
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error: any) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-8 space-y-8 bg-neutral-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-300">
      
      {/* --- JUDUL --- */}
      <div className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold bg-linear-to-r from-[#c66756] to-[#d17665] bg-clip-text text-transparent">
            Formulir Surat Perjalanan Dinas (SPD)
        </h1>
        <p className="text-sm text-neutral-600">
            Berdasarkan PMK 113/PMK.05/2012. Isi semua detail perjalanan dinas.
        </p>
      </div>

      {/* --- SEKSI 1: DETAIL ADMINISTRASI & PEGAWAI UTAMA --- */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">I. Data Utama SPD</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Nomor SPD</label>
                <input type="text" {...register("spd_nomor", { required: true })} placeholder="Nomor Surat (Ex: 001/SPD/FST/XII/2025)" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Nama PPK (Pejabat Pembuat Komitmen)</label>
                <input type="text" {...register("ppk_name", { required: true })} placeholder="Nama Lengkap PPK" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">NIP PPK</label>
                <input type="text" {...register("ppk_nip", { required: true })} placeholder="NIP PPK" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
        </div>
        
        <h3 className="text-lg font-semibold text-neutral-700 mt-4">Pegawai yang Melaksanakan Dinas (Item 2)</h3>
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Nama Pegawai</label>
                <input type="text" {...register("pegawai_utama.nama", { required: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">NIP Pegawai</label>
                <input type="text" {...register("pegawai_utama.nip", { required: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Pangkat dan Golongan (Item 3a)</label>
                <input type="text" {...register("pangkat_gol")} placeholder="Ex: Pembina IV/a" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Jabatan/Instansi (Item 3b)</label>
                <input type="text" {...register("jabatan_instansi", { required: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600">Tingkat Biaya Perjalanan Dinas (Item 3c)</label>
                <input type="text" {...register("tingkat_biaya")} placeholder="Ex: Tingkat A / B / C" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
        </div>
      </div>
      
      {/* --- SEKSI 2: DETAIL PERJALANAN --- */}
      <div className="space-y-6 pt-6 border-t border-neutral-200">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">II. Rincian Tugas</h2>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-600">Maksud Perjalanan Dinas (Item 4)</label>
            <textarea {...register("maksud_dinas", { required: true })} rows={3} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"></textarea>
        </div>
        <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Alat Angkutan (Item 5)</label>
                <input type="text" {...register("alat_angkut")} placeholder="Ex: Pesawat / Mobil Dinas / KA" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tempat Berangkat (Item 6a)</label>
                <input type="text" {...register("tempat_berangkat", { required: true })} placeholder="Ex: Padang" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tempat Tujuan (Item 6b)</label>
                <input type="text" {...register("tempat_tujuan", { required: true })} placeholder="Ex: Jakarta / Bandung" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Lama Hari (Item 7a)</label>
                <input type="number" {...register("lama_hari", { required: true, valueAsNumber: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tanggal Berangkat (Item 7b)</label>
                <input type="date" {...register("tgl_berangkat", { required: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-600">Tanggal Harus Kembali (Item 7c)</label>
                <input type="date" {...register("tgl_kembali", { required: true })} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
            </div>
        </div>
      </div>
      
      {/* --- SEKSI 3: PENGIKUT (ARRAY DINAMIS) --- */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#5c7a54]">III. Daftar Pengikut (Item 8)</h2>
            <button
                type="button"
                onClick={() => append({ nama: '', tgl_lahir: '', keterangan: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#c66756] rounded-lg shadow-sm hover:bg-[#b35647] transition-all duration-200"
            >
                <Plus className="h-4 w-4" /> Tambah Pengikut
            </button>
        </div>
        <p className="text-sm text-neutral-600">Jika ada pegawai lain yang menyertai dinas (istri/staf/lainnya).</p>
        
        <div className="space-y-4">
            {fields.map((item, index) => (
                <div key={item.id} className="p-4 bg-white rounded-lg shadow-md border border-neutral-200 relative grid grid-cols-1 md:grid-cols-4 gap-4">
                    <h3 className="text-md font-semibold text-neutral-800 md:col-span-4">Pengikut #{index + 1}</h3>
                    
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-neutral-600">Nama</label>
                        <input type="text" {...register(`pengikut_list.${index}.nama`, { required: true })} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-neutral-600">Tanggal Lahir</label>
                        <input type="date" {...register(`pengikut_list.${index}.tgl_lahir`)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="block text-xs font-medium text-neutral-600">Keterangan</label>
                        <input type="text" {...register(`pengikut_list.${index}.keterangan`)} placeholder="Hubungan atau Jabatan" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900" />
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-[#c66756] transition-colors duration-200"
                        title="Hapus Pengikut"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* --- SUBMIT --- */}
      <div className="pt-6 border-t border-neutral-300">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-linear-to-r from-[#5c7a54] to-[#6b8c62] hover:from-[#485f41] disabled:opacity-50 transition-all duration-200"
        >
          {isSubmitting ? (
            'Memproses Dokumen...'
          ) : (
            <>
              <Upload className="h-6 w-6 mr-2" />
              Generate & Download SPD
            </>
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-3 bg-[#5c7a54]/10 border border-[#5c7a54]/20 rounded-lg text-sm text-[#5c7a54] font-medium">
            Dokumen SPD berhasil dibuat dan diunduh!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 p-3 bg-[#c66756]/10 border border-[#c66756]/20 rounded-lg text-sm text-[#c66756] font-medium">
            Terjadi kesalahan saat membuat SPD. Silakan periksa koneksi server dan input Anda.
          </div>
        )}
      </div>
    </form>
  );
}