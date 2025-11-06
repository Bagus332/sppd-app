// frontend/app/components/FormSuratGabungan.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Plus, X, Upload } from 'lucide-react';

type PegawaiItem = {
  nama_pegawai: string;
  nip_pegawai: string;
  pangkat_gol?: string;         // sesuai SuratTugasForm (pangkat_gol)
  jabatan_pegawai?: string;     // sesuai SuratTugasForm
};

type PengikutItem = {
  nama: string;
  tgl_lahir?: string;
  keterangan?: string;
};

type FormSuratGabunganData = {
  // Surat Tugas (dari SuratTugasForm)
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

  // SPD (dari SPDForm)
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

export default function PerjalananDinas(){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormSuratGabunganData>({
    defaultValues: {
      pegawai_list: [{ nama_pegawai: '', nip_pegawai: '', pangkat_gol: '', jabatan_pegawai: '' }],
      pengikut_list: [],
      tempat_berangkat: 'Padang',
      tingkat_biaya: 'DIPA FST',
      lama_hari: 1,
      tanggal_surat: new Date().toISOString().substring(0, 10),
    },
  });

  const { fields: pegawaiFields, append: appendPegawai, remove: removePegawai } = useFieldArray({
    control,
    name: 'pegawai_list',
  });

  const { fields: pengikutFields, append: appendPengikut, remove: removePengikut } = useFieldArray({
    control,
    name: 'pengikut_list',
  });

  const onSubmit: SubmitHandler<FormSuratGabunganData> = async (data) => {
    // Basic validation mirip form asli
    if (!data.pegawai_list || data.pegawai_list.length === 0) {
      alert('Minimal harus ada satu pegawai yang ditugaskan.');
      return;
    }
    const invalidPegawai = data.pegawai_list.some(p => !p.nama_pegawai || !p.nip_pegawai);
    if (invalidPegawai) {
      alert('Pastikan semua pegawai memiliki nama dan NIP.');
      return;
    }

    // If pengikut exist, ensure name not empty
    if (data.pengikut_list && data.pengikut_list.some(p => p.nama === '')) {
      alert('Jika menambahkan pengikut, kolom nama wajib diisi.');
      return;
    }

    const res = await fetch('http://localhost:8080/api/surat/simpan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    });

    if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Gagal menyimpan data (server error)');
    }

    // Jika berhasil
    setSubmitStatus('success');
    reset();
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-8 space-y-8 bg-neutral-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-300">
      {/* Header */}
      <div className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold text-[#5c7a54]">Form Gabungan — Surat Tugas & SPD</h1>
        <p className="text-sm text-neutral-600">Isi semua field yang relevan. Field yang sama akan digunakan keduanya.</p>
      </div>

      {/* I. Data Administrasi & Pegawai */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">I. Data Administrasi & Pegawai</h2>

        {/* Row: SPD nomor, PPK name, PPK NIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium font-medium text-neutral-600">Nomor SPD</label>
            <input type="text" {...register('spd_nomor')} placeholder="Ex: 001/SPD/FST/XII/2025" className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Nama PPK</label>
            <input type="text" {...register('ppk_name')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">NIP PPK</label>
            <input type="text" {...register('ppk_nip')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-neutral-700 mt-4">Pegawai yang Melaksanakan Dinas (daftar)</h3>

        <div className="space-y-4">
          {pegawaiFields.map((field, idx) => (
            <div key={field.id} className="p-4 bg-white rounded-lg shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div>
                <label className="text-xs font-medium text-neutral-600">Nama <span className="text-[#c66756]">*</span></label>
                <input {...register(`pegawai_list.${idx}.nama_pegawai` as const, { required: true })} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">NIP <span className="text-[#c66756]">*</span></label>
                <input {...register(`pegawai_list.${idx}.nip_pegawai` as const, { required: true })} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Pangkat/Gol</label>
                <input {...register(`pegawai_list.${idx}.pangkat_gol` as const)} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Jabatan</label>
                <input {...register(`pegawai_list.${idx}.jabatan_pegawai` as const)} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>

              {pegawaiFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePegawai(idx)}
                  className="absolute top-3 right-3 text-neutral-500 hover:text-[#c66756]"
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
          <textarea {...register('maksud_dinas')} rows={3} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Alat Angkut</label>
            <input {...register('alat_angkut')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" placeholder="Ex: Mobil Dinas / Pesawat" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tempat Berangkat</label>
            <input {...register('tempat_berangkat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tempat Tujuan</label>
            <input {...register('tempat_tujuan')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Lama Hari</label>
            <input type="number" {...register('lama_hari', { valueAsNumber: true })} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tanggal Berangkat</label>
            <input type="date" {...register('tgl_berangkat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tanggal Kembali</label>
            <input type="date" {...register('tgl_kembali')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
          </div>
        </div>
      </section>

      {/* III. Pengikut (opsional) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#5c7a54]">III. Pengikut (Opsional)</h2>
          <button type="button" onClick={() => appendPengikut({ nama: '', tgl_lahir: '', keterangan: '' })} className="inline-flex items-center gap-2 bg-[#c66756] text-white px-3 py-1 rounded-lg">
            <Plus className="h-4 w-4" /> Tambah Pengikut
          </button>
        </div>

        <div className="space-y-4">
          {pengikutFields.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded border relative">
              <div>
                <label className="text-xs font-medium text-neutral-600">Nama</label>
                <input {...register(`pengikut_list.${idx}.nama` as const)} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Tanggal Lahir</label>
                <input type="date" {...register(`pengikut_list.${idx}.tgl_lahir` as const)} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-neutral-600">Keterangan</label>
                <input {...register(`pengikut_list.${idx}.keterangan` as const)} className="w-full px-3 py-2 bg-neutral-50 border rounded text-black" />
              </div>

              <button type="button" onClick={() => removePengikut(idx)} className="absolute top-3 right-3 text-neutral-500 hover:text-[#c66756]">
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* IV. Surat Tugas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-600">Nomor Surat Tugas</label>
          <input {...register('nomor')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600">Dasar DIPA</label>
          <input {...register('dasar_dipa')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600">Tanggal Surat</label>
          <input type="date" {...register('tanggal_surat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-neutral-600">Nama Dekan (Tanda Tangan)</label>
          <input {...register('nama_dekan')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black" />
        </div>
      </section>

      {/* --- SUBMIT --- */}
      <div className="pt-6 border-t border-neutral-300">
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] hover:from-[#485f41] disabled:opacity-50 transition-all duration-200"
        >
            {isSubmitting ? (
                'Menyimpan Data...'
        ) : (
            <>
                <Upload className="h-6 w-6 mr-2" />
                Simpan Data Perjalanan Dinas
            </>
            )}
        </button>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-[#5c7a54]/10 border border-[#5c7a54]/20 rounded-lg text-sm text-[#5c7a54] font-medium">
                Data perjalanan dinas berhasil disimpan.
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-[#c66756]/10 border border-[#c66756]/20 rounded-lg text-sm text-[#c66756] font-medium">
                Terjadi kesalahan saat menyimpan data. Silakan periksa koneksi server dan input Anda.
            </div>
        )}
        </div>
    </form>
  );
}
