'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Plus, X, Upload, Search, UserCheck } from 'lucide-react';

// Tipe data untuk Pegawai dari Database (sesuai model Pegawai)
type PegawaiDB = {
  id: number;
  nama: string;
  nip: string;
  pangkat_golongan: string;
  jabatan_instansi: string;
};

type PegawaiItem = {
  nama_pegawai: string;
  nip_pegawai: string;
  pangkat_gol?: string;
  jabatan_pegawai?: string;
};

type PengikutItem = {
  nama: string;
  tgl_lahir?: string;
  keterangan?: string;
};

type FormSuratGabunganData = {
  nomor?: string;
  menimbang_kegiatan?: string;
  dasar_dipa?: string;
  dasar_dipa_tanggal?: string;
  tujuan_kegiatan?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  tanggal_surat?: string;
  nama_dekan?: string;
  pegawai_list: PegawaiItem[];
  spd_nomor?: string;
  ppk_name?: string;
  ppk_nip?: string;
  pangkat_gol?: string;
  jabatan_instansi?: string;
  tingkat_biaya?: string;
  maksud_dinas?: string;
  alat_angkut?: string;
  tempat_berangkat?: string;
  tempat_tujuan?: string;
  lama_hari?: number | string;
  tgl_berangkat?: string;
  tgl_kembali?: string;
  pengikut_list: PengikutItem[];
};

export default function PerjalananDinas() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // State untuk menyimpan data pegawai dari database
  const [dbPegawai, setDbPegawai] = useState<PegawaiDB[]>([]);

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormSuratGabunganData>({
    defaultValues: {
      pegawai_list: [{ nama_pegawai: '', nip_pegawai: '', pangkat_gol: '', jabatan_pegawai: '' }],
      pengikut_list: [],
      tempat_berangkat: 'Padang',
      tingkat_biaya: 'DIPA FST',
      lama_hari: 1,
      tanggal_surat: new Date().toISOString().substring(0, 10),
    },
  });

  // Watch tanggal berangkat dan kembali
  const tglBerangkat = watch('tgl_berangkat');
  const tglKembali = watch('tgl_kembali');

  // Auto-calculate lama_hari ketika tanggal berubah
  useEffect(() => {
    if (tglBerangkat && tglKembali) {
      const startDate = new Date(tglBerangkat);
      const endDate = new Date(tglKembali);
      
      // Hitung selisih hari (tambah 1 untuk include hari terakhir)
      const timeDiff = endDate.getTime() - startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      if (dayDiff > 0) {
        setValue('lama_hari', dayDiff);
      }
    }
  }, [tglBerangkat, tglKembali, setValue]);

  const { fields: pegawaiFields, append: appendPegawai, remove: removePegawai } = useFieldArray({
    control,
    name: 'pegawai_list',
  });


  // 1. FETCH DATA PEGAWAI SAAT KOMPONEN DIMUAT
  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/pegawai');
        if (res.ok) {
          const data = await res.json();
          // Handle jika return API berupa array langsung atau object { data: [...] }
          setDbPegawai(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
      }
    };
    fetchPegawai();
  }, []);

  // 2. FUNGSI AUTO-FILL SAAT PEGAWAI DIPILIH DARI DROPDOWN
  const handleSelectPegawai = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedPegawai = dbPegawai.find(p => p.id.toString() === selectedId);

    if (selectedPegawai) {
      // Isi form secara programatis menggunakan setValue
      setValue(`pegawai_list.${index}.nama_pegawai`, selectedPegawai.nama);
      setValue(`pegawai_list.${index}.nip_pegawai`, selectedPegawai.nip);
      setValue(`pegawai_list.${index}.pangkat_gol`, selectedPegawai.pangkat_golongan);
      setValue(`pegawai_list.${index}.jabatan_pegawai`, selectedPegawai.jabatan_instansi);
    }
  };

  //  FUNGSI AUTO-FILL UNTUK PPK (Ambil dari DB Pegawai)
  const handleSelectPPK = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedPegawai = dbPegawai.find(p => p.id.toString() === selectedId);

    if (selectedPegawai) {
      setValue('ppk_name', selectedPegawai.nama);
      setValue('ppk_nip', selectedPegawai.nip);
    }
  };

  const onSubmit: SubmitHandler<FormSuratGabunganData> = async (data) => {
    if (!data.pegawai_list || data.pegawai_list.length === 0) {
      alert('Minimal harus ada satu pegawai yang ditugaskan.');
      return;
    }
    const invalidPegawai = data.pegawai_list.some(p => !p.nama_pegawai || !p.nip_pegawai);
    if (invalidPegawai) {
      alert('Pastikan semua pegawai memiliki nama dan NIP.');
      return;
    }

    if (data.pengikut_list && data.pengikut_list.some(p => p.nama === '')) {
      alert('Jika menambahkan pengikut, kolom nama wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('http://localhost:8080/api/surat/simpan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Gagal menyimpan data');
      }

      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-8 space-y-8 bg-neutral-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-300">
      {/* Header */}
      <div className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold text-[#5c7a54]">Form Gabungan — Surat Tugas & SPD</h1>
        <p className="text-sm text-neutral-600">Isi semua field yang relevan. Gunakan pencarian untuk mengisi data pegawai secara cepat.</p>
      </div>

      {/* I. Data Administrasi & Pegawai */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">I. Data Administrasi & Pegawai</h2>

        {/* Fitur Quick Fill untuk PPK */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
            <Search size={18} className="text-blue-600" />
            <div className="flex-1">
            <label className="text-xs font-bold text-blue-700 block mb-1">Pilih PPK dari Database (Opsional)</label>
            <select 
                className="w-full text-sm bg-white border border-blue-200 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                onChange={handleSelectPPK}
                defaultValue=""
            >
                <option value="" disabled>-- Cari Pejabat Pembuat Komitmen --</option>
                {dbPegawai.map((p) => (
                <option key={p.id} value={p.id}>{p.nama} - {p.jabatan_instansi}</option>
                ))}
            </select>
            </div>
        </div>

        {/* Row: SPD nomor, PPK name, PPK NIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Nomor SPD</label>
            <input 
              type="text" 
              {...register('spd_nomor')} 
              placeholder="Ex: 001/SPD/FST/XII/2025" 
              className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Nama PPK</label>
            <input 
              type="text" 
              {...register('ppk_name')} 
              className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">NIP PPK</label>
            <input 
              type="text" 
              {...register('ppk_nip')} 
              className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
            />
          </div>
        </div>

        <div className="flex justify-between items-end mt-6">
           <h3 className="text-lg font-semibold text-neutral-700">Pegawai yang Melaksanakan Dinas</h3>
           <button
              type="button"
              onClick={() => appendPegawai({ nama_pegawai: '', nip_pegawai: '', pangkat_gol: '', jabatan_pegawai: '' })}
              className="text-sm flex items-center gap-1 text-[#5c7a54] hover:text-[#485f41] font-medium"
            >
              <Plus size={16} /> Tambah Pegawai
            </button>
        </div>
        
        <div className="space-y-4">
          {pegawaiFields.map((field, idx) => (
            <div key={field.id} className="p-5 bg-white rounded-xl shadow-sm border border-neutral-200 relative transition-all hover:shadow-md">
              
              {/* Fitur Quick Fill dari Database */}
              <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-3">
                 <UserCheck size={18} className="text-green-600" />
                 <div className="flex-1">
                    <label className="text-xs font-bold text-green-700 block mb-1">Isi Otomatis dari Database (Opsional)</label>
                    <select 
                      className="w-full text-sm bg-white border border-green-200 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-green-500"
                      onChange={(e) => handleSelectPegawai(idx, e)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Pilih Pegawai --</option>
                      {dbPegawai.map((p) => (
                        <option key={p.id} value={p.id}>{p.nama} - {p.nip}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-600">Nama <span className="text-[#c66756]">*</span></label>
                  <input 
                    {...register(`pegawai_list.${idx}.nama_pegawai` as const, { required: true })} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                    placeholder="Ketik manual atau pilih diatas"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">NIP <span className="text-[#c66756]">*</span></label>
                  <input 
                    {...register(`pegawai_list.${idx}.nip_pegawai` as const, { required: true })} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">Pangkat/Gol</label>
                  <input 
                    {...register(`pegawai_list.${idx}.pangkat_gol` as const)} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">Jabatan</label>
                  <input 
                    {...register(`pegawai_list.${idx}.jabatan_pegawai` as const)} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                  />
                </div>
              </div>

              {pegawaiFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePegawai(idx)}
                  className="absolute top-3 right-3 text-neutral-400 hover:text-[#c66756] transition-colors"
                  title="Hapus Pegawai"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* II. Rincian Tugas / Perjalanan */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">II. Rincian Tugas / Perjalanan</h2>

        <div>
          <label className="block text-sm font-medium text-neutral-600">Keperluan / Maksud Perjalanan</label>
          <textarea {...register('maksud_dinas')} rows={3} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Alat Angkut</label>
            <input {...register('alat_angkut')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" placeholder="Ex: Mobil Dinas / Pesawat" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tempat Berangkat</label>
            <input {...register('tempat_berangkat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tempat Tujuan</label>
            <input {...register('tempat_tujuan')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Lama Hari</label>
            <input type="number" {...register('lama_hari', { valueAsNumber: true })} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tanggal Berangkat</label>
            <input type="date" {...register('tgl_berangkat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tanggal Kembali</label>
            <input type="date" {...register('tgl_kembali')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
        </div>
      </section>

      {/* IV. Surat Tugas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
         <div className="md:col-span-3">
             <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">IV. Atribut Surat Tugas</h2>
         </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600">Nomor Surat Tugas</label>
          <input {...register('nomor')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" placeholder="Ex: B-123/Un.13/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600">Dasar DIPA</label>
          <input {...register('dasar_dipa')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" placeholder="Ex: DIPA-025..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600">Tanggal Surat</label>
          <input type="date" {...register('tanggal_surat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-neutral-600">Nama Dekan (Penanda Tangan)</label>
          <input {...register('nama_dekan')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
        </div>
      </section>

      {/* --- SUBMIT --- */}
      <div className="pt-6 border-t border-neutral-300">
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] hover:from-[#485f41] hover:to-[#5c7a54] disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
        >
            {isSubmitting ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Menyimpan Data...
               </span>
            ) : (
            <>
                <Upload className="h-5 w-5 mr-2" />
                Simpan Data Perjalanan Dinas
            </>
            )}
        </button>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-[#5c7a54]/10 border border-[#5c7a54]/30 rounded-lg text-sm text-[#5c7a54] font-medium flex items-center gap-2">
                <UserCheck size={18} /> Data perjalanan dinas berhasil disimpan ke database.
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-[#c66756]/10 border border-[#c66756]/30 rounded-lg text-sm text-[#c66756] font-medium flex items-center gap-2">
                <X size={18} /> Terjadi kesalahan saat menyimpan data. Silakan periksa koneksi server dan input Anda.
            </div>
        )}
        </div>
    </form>
  );
}