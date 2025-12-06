"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

export default function EditSuratPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nomor: '',
    spd_nomor: '',
    maksud_dinas: '',
    tgl_berangkat: '',
    tgl_kembali: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<any>(API_ENDPOINTS.SURAT_BY_ID(Number(id)));
        setForm({
          nomor: data.nomor || '',
          spd_nomor: data.spd_nomor || '',
          maksud_dinas: data.maksud_dinas || '',
          tgl_berangkat: data.tgl_berangkat ? new Date(data.tgl_berangkat).toISOString().slice(0,10) : '',
          tgl_kembali: data.tgl_kembali ? new Date(data.tgl_kembali).toISOString().slice(0,10) : '',
        });
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      setSaving(true);
      const payload = {
        nomor: form.nomor,
        spd_nomor: form.spd_nomor,
        maksud_dinas: form.maksud_dinas,
        tgl_berangkat: form.tgl_berangkat || null,
        tgl_kembali: form.tgl_kembali || null,
      };
      await apiClient.put(API_ENDPOINTS.SURAT_BY_ID(Number(id)), payload);
      router.push('/daftar-surat');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 max-w-2xl">
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-neutral-700 mb-1">Nomor Surat</span>
                <input name="nomor" value={form.nomor} onChange={handleChange} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-neutral-700 mb-1">Nomor SPD</span>
                <input name="spd_nomor" value={form.spd_nomor} onChange={handleChange} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-neutral-700 mb-1">Maksud / Tujuan</span>
                <textarea name="maksud_dinas" value={form.maksud_dinas} onChange={handleChange} className="border p-2 rounded h-28" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-700 mb-1">Tanggal Berangkat</span>
                  <input type="date" name="tgl_berangkat" value={form.tgl_berangkat} onChange={handleChange} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-700 mb-1">Tanggal Kembali</span>
                  <input type="date" name="tgl_kembali" value={form.tgl_kembali} onChange={handleChange} className="border p-2 rounded" />
                </label>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#5c7a54] text-white rounded hover:opacity-90">
                  <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button onClick={() => router.push('/daftar-surat')} className="px-4 py-2 bg-white border rounded">Batal</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
