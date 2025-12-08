'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Plus, X, Upload, UserCheck, Save } from 'lucide-react';
import useSWR from 'swr';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

// Tipe data untuk Pegawai dari Database
type PegawaiDB = {
  id: number;
  nama: string;
  nip: string;
  tanggal_lahir: string; // Field ini penting untuk SPD
  pangkat_golongan: string;
  jabatan_instansi: string;
};

type PegawaiItem = {
  nama_pegawai: string;
  nip_pegawai: string;
  tanggal_lahir?: string; // Ditambahkan
  pangkat_gol?: string;
  jabatan_pegawai?: string;
};

export type FormSuratGabunganData = {
  id?: number;
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
  // Field ppk_name & ppk_nip dihapus dari form input karena otomatis
  tingkat_biaya?: string;
  maksud_dinas?: string;
  alat_angkut?: string;
  tempat_berangkat?: string;
  tempat_tujuan?: string;
  lama_hari?: number | string;
  tgl_berangkat?: string;
  tgl_kembali?: string;
};

interface PerjalananDinasProps {
  initialData?: FormSuratGabunganData;
  isEdit?: boolean;
}

export default function PerjalananDinas({ initialData, isEdit = false }: PerjalananDinasProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<FormSuratGabunganData>({
    defaultValues: {
      pegawai_list: [], 
      tempat_berangkat: 'Padang',
      tingkat_biaya: 'DIPA FST',
      lama_hari: 0,
      tanggal_surat: new Date().toISOString().substring(0, 10),
      ...initialData
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Format dates to YYYY-MM-DD for input[type="date"]
      const formattedData = {
        ...initialData,
        tgl_berangkat: initialData.tgl_berangkat ? new Date(initialData.tgl_berangkat).toISOString().split('T')[0] : '',
        tgl_kembali: initialData.tgl_kembali ? new Date(initialData.tgl_kembali).toISOString().split('T')[0] : '',
        tanggal_surat: initialData.tanggal_surat ? new Date(initialData.tanggal_surat).toISOString().split('T')[0] : '',
      };
      reset(formattedData);
    }
  }, [initialData, reset]);

  const { fields: pegawaiFields, append: appendPegawai, remove: removePegawai } = useFieldArray({
    control,
    name: 'pegawai_list',
  });

  // --- WATCHERS UNTUK KALKULASI OTOMATIS ---
  const tglBerangkat = watch('tgl_berangkat');
  const tglKembali = watch('tgl_kembali');

  // Efek untuk menghitung lama hari otomatis
  useEffect(() => {
    if (tglBerangkat && tglKembali) {
      const start = new Date(tglBerangkat);
      const end = new Date(tglKembali);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setValue('lama_hari', diffDays);
      } else {
        setValue('lama_hari', 0);
      }
    }
  }, [tglBerangkat, tglKembali, setValue]);
  
  // Menggunakan SWR untuk caching data pegawai
  const fetcher = (url: string) => apiClient.get<PegawaiDB[] | { data: PegawaiDB[] }>(url).then(res => {
      return Array.isArray(res) ? res : (res as any).data || [];
  });


  const { data: dbPegawai = [], error: pegawaiError } = useSWR(API_ENDPOINTS.PEGAWAI, fetcher);

  // 2. AUTO-FILL PEGAWAI (Termasuk Tanggal Lahir)
  const handleSelectPegawai = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedPegawai = dbPegawai.find((p: PegawaiDB) => p.id.toString() === selectedId);

    if (selectedPegawai) {
      setValue(`pegawai_list.${index}.nama_pegawai`, selectedPegawai.nama);
      setValue(`pegawai_list.${index}.nip_pegawai`, selectedPegawai.nip);
      setValue(`pegawai_list.${index}.tanggal_lahir`, selectedPegawai.tanggal_lahir); // Isi Tanggal Lahir
      setValue(`pegawai_list.${index}.pangkat_gol`, selectedPegawai.pangkat_golongan);
      setValue(`pegawai_list.${index}.jabatan_pegawai`, selectedPegawai.jabatan_instansi);
    }
  };

  const onSubmit: SubmitHandler<FormSuratGabunganData> = async (data) => {
    if (data.pegawai_list && data.pegawai_list.length > 0) {
      const invalidPegawai = data.pegawai_list.some(p => !p.nama_pegawai || !p.nip_pegawai);
      if (invalidPegawai) {
        alert('Jika menambahkan pegawai, pastikan Nama dan NIP terisi.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Payload dikirim apa adanya, backend akan menghandle PPK dari pegawai pertama
      const payload = { ...data, pengikut_list: [] };

      if (isEdit && initialData?.id) {
          await apiClient.put(API_ENDPOINTS.SURAT_BY_ID(initialData.id), payload);
      } else {
          await apiClient.post(API_ENDPOINTS.SURAT + '/simpan', payload);
      }

      setSubmitStatus('success');
      
      if (!isEdit) {
        reset();
      }
      
      setTimeout(() => {
          setSubmitStatus('idle');
          if (isEdit) {
              router.push('/daftar-surat');
          }
      }, 1500);
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
        <h1 className="text-3xl font-bold text-[#5c7a54]">
            {isEdit ? 'Edit Data Perjalanan Dinas' : 'Form Gabungan — Surat Tugas & SPD'}
        </h1>
        <p className="text-sm text-neutral-600">Pegawai Pertama otomatis dianggap sebagai <b>Pejabat Pembuat Komitmen (PPK)</b>.</p>
      </div>

      {/* I. Data Administrasi & Pegawai */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">I. Data Administrasi & Pegawai</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600">Nomor SPD</label>
            <input type="text" {...register('spd_nomor')} placeholder="Ex: 001/SPD/FST/XII/2025" className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          {/* Input PPK manual dihapus */}
        </div>

        <div className="flex justify-between items-end mt-6 border-b border-neutral-200 pb-2">
           <h3 className="text-lg font-semibold text-neutral-700">Pegawai yang Melaksanakan Dinas</h3>
           <button
              type="button"
              onClick={() => appendPegawai({ nama_pegawai: '', nip_pegawai: '', tanggal_lahir: '', pangkat_gol: '', jabatan_pegawai: '' })}
              className="text-sm flex items-center gap-1 text-[#5c7a54] hover:text-[#485f41] font-medium"
            >
              <Plus size={16} /> Tambah Pegawai
            </button>
        </div>

        <div className="space-y-4">
          {pegawaiFields.length === 0 && (
            <div className="p-6 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 text-neutral-400 text-sm">
              Belum ada pegawai. <b>Pegawai pertama yang ditambahkan akan menjadi PPK.</b>
            </div>
          )}

          {pegawaiFields.map((field, idx) => (
            <div key={field.id} className="p-5 bg-white rounded-xl shadow-sm border border-neutral-200 relative transition-all hover:shadow-md">
              
              {/* Badge untuk Pegawai Pertama = PPK */}
              {idx === 0 && (
                <div className="absolute -top-3 left-4 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded border border-blue-200">
                  PPK / Ketua Tim
                </div>
              )}

              {/* Fitur Quick Fill */}
              <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-3">
                 <UserCheck size={18} className="text-green-600" />
                 <div className="flex-1">
                    <label className="text-xs font-bold text-green-700 block mb-1">Isi Otomatis dari Database</label>
                    <select 
                      className="w-full text-sm bg-white border border-green-200 rounded px-2 py-1.5 text-gray-700 focus:outline-none focus:border-green-500"
                      onChange={(e) => handleSelectPegawai(idx, e)}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Pilih Pegawai --</option>
                      {dbPegawai.map((p: PegawaiDB) => (
                        <option key={p.id} value={p.id}>{p.nama} - {p.nip}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-600">Nama</label>
                  <input 
                    {...register(`pegawai_list.${idx}.nama_pegawai` as const)} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                    placeholder="Nama Pegawai"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">NIP</label>
                  <input 
                    {...register(`pegawai_list.${idx}.nip_pegawai` as const)} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                  />
                </div>
                
                {/* Input Tanggal Lahir (Baru) */}
                <div>
                  <label className="text-xs font-medium text-neutral-600">Tanggal Lahir</label>
                  <input 
                    type="date"
                    {...register(`pegawai_list.${idx}.tanggal_lahir` as const)} 
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
                <div className="md:col-span-2 lg:col-span-4">
                  <label className="text-xs font-medium text-neutral-600">Jabatan</label>
                  <input 
                    {...register(`pegawai_list.${idx}.jabatan_pegawai` as const)} 
                    className="w-full px-3 py-2 bg-neutral-50 border rounded text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" 
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removePegawai(idx)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-[#c66756] transition-colors"
                title="Hapus Pegawai"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* II. Rincian Tugas / Perjalanan (Sama seperti sebelumnya) */}
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
            <label className="block text-sm font-medium text-neutral-600">Tanggal Berangkat</label>
            <input type="date" {...register('tgl_berangkat')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Tanggal Kembali</label>
            <input type="date" {...register('tgl_kembali')} className="w-full px-4 py-2.5 bg-neutral-50 border rounded-lg text-black focus:ring-[#5c7a54] focus:border-[#5c7a54]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600">Lama Hari <span className="text-xs text-gray-400 font-normal">(Otomatis)</span></label>
            <input 
              type="number" 
              {...register('lama_hari', { valueAsNumber: true })} 
              readOnly 
              className="w-full px-4 py-2.5 bg-neutral-100 border border-neutral-300 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none" 
            />
          </div>
        </div>
      </section>

      {/* III. Atribut Surat Tugas (Sama seperti sebelumnya) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
         <div className="md:col-span-3">
             <h2 className="text-xl font-semibold text-[#5c7a54] border-b pb-2">III. Atribut Surat Tugas</h2>
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

      {/* SUBMIT */}
      <div className="pt-6 border-t border-neutral-300">
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-[#5c7a54] to-[#6b8c62] hover:from-[#485f41] hover:to-[#5c7a54] disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
        >
            {isSubmitting ? 'Menyimpan Data...' : (
            <>
                {isEdit ? <Save className="h-5 w-5 mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                {isEdit ? 'Simpan Perubahan' : 'Simpan Data Perjalanan Dinas'}
            </>
            )}
        </button>
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-[#5c7a54]/10 border border-[#5c7a54]/30 rounded-lg text-sm text-[#5c7a54] font-medium flex items-center gap-2">
                <UserCheck size={18} /> {isEdit ? 'Data berhasil diperbarui.' : 'Data perjalanan dinas berhasil disimpan ke database.'}
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-[#c66756]/10 border border-[#c66756]/30 rounded-lg text-sm text-[#c66756] font-medium flex items-center gap-2">
                <X size={18} /> Terjadi kesalahan saat menyimpan data.
            </div>
        )}
        </div>
    </form>
  );
}