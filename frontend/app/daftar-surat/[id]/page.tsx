"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, FileDown, Calendar, User, MapPin, Briefcase, Hash } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

interface Pegawai {
  nama_pegawai: string;
  nip_pegawai: string;
  pangkat_gol: string;
  jabatan_pegawai: string;
}

interface Pengikut {
  nama: string;
  tgl_lahir: string;
  keterangan: string;
}

interface SuratDetail {
  id: number;
  nomor: string;
  spd_nomor: string;
  maksud_dinas: string;
  tgl_berangkat: string;
  tgl_kembali: string;
  tanggal_surat: string;
  tempat_berangkat: string;
  tempat_tujuan: string;
  alat_angkut: string;
  lama_hari: string;
  dasar_dipa: string;
  nama_dekan: string;
  pegawai_list: Pegawai[];
  pengikut_list: Pengikut[];
  createdAt: string;
}

export default function DetailSuratPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [surat, setSurat] = useState<SuratDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<'tugas' | 'spd' | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<SuratDetail>(API_ENDPOINTS.SURAT_BY_ID(Number(id)));
        setSurat(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = async (type: 'tugas' | 'spd') => {
    if (!surat) return;
    try {
      setDownloading(type);
      const blob = await apiClient.downloadFile(`/api/surat/${surat.id}/download/${type}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let filename = type === 'tugas' ? 'Surat_Tugas.docx' : 'SPD.docx';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert(`Gagal mengunduh ${type === 'tugas' ? 'Surat Tugas' : 'SPD'}`);
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c7a54]"></div>
      </div>
    );
  }

  if (error || !surat) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
          <p>{error || 'Data surat tidak ditemukan'}</p>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-white border rounded">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="p-6 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
          
          <div className="flex gap-3">
             <button
                onClick={() => handleDownload('tugas')}
                disabled={downloading === 'tugas'}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                 {downloading === 'tugas' ? (
                   <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                 ) : <FileText size={18} />}
                 Unduh Surat Tugas
              </button>
              <button
                onClick={() => handleDownload('spd')}
                disabled={downloading === 'spd'}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
              >
                 {downloading === 'spd' ? (
                   <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                 ) : <FileDown size={18} />}
                 Unduh SPD
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#5c7a54] mb-4 flex items-center gap-2">
                <Briefcase size={20} /> Informasi Perjalanan
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Maksud / Tujuan Dinas</label>
                  <p className="text-neutral-900 font-medium mt-1">{surat.maksud_dinas}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="text-sm text-neutral-500 font-medium">Tempat Berangkat</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-neutral-400" />
                        <span className="text-neutral-900">{surat.tempat_berangkat || '-'}</span>
                      </div>
                   </div>
                   <div>
                      <label className="text-sm text-neutral-500 font-medium">Tempat Tujuan</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-neutral-400" />
                        <span className="text-neutral-900">{surat.tempat_tujuan || '-'}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label className="text-sm text-neutral-500 font-medium">Tanggal Berangkat</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={16} className="text-neutral-400" />
                        <span className="text-neutral-900">{formatDate(surat.tgl_berangkat)}</span>
                      </div>
                   </div>
                   <div>
                      <label className="text-sm text-neutral-500 font-medium">Tanggal Kembali</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={16} className="text-neutral-400" />
                        <span className="text-neutral-900">{formatDate(surat.tgl_kembali)}</span>
                      </div>
                   </div>
                   <div>
                      <label className="text-sm text-neutral-500 font-medium">Lama Perjalanan</label>
                      <p className="text-neutral-900 mt-1">{surat.lama_hari ? `${surat.lama_hari} Hari` : '-'}</p>
                   </div>
                </div>
                
                <div>
                   <label className="text-sm text-neutral-500 font-medium">Alat Angkut</label>
                   <p className="text-neutral-900 mt-1">{surat.alat_angkut || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#5c7a54] mb-4 flex items-center gap-2">
                <User size={20} /> Daftar Pegawai
              </h2>
              
              <div className="space-y-4">
                {surat.pegawai_list && surat.pegawai_list.length > 0 ? (
                  surat.pegawai_list.map((pegawai, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                      <div className="font-semibold text-neutral-900">{pegawai.nama_pegawai}</div>
                      <div className="text-sm text-neutral-600">NIP: {pegawai.nip_pegawai}</div>
                      <div className="text-sm text-neutral-600">{pegawai.pangkat_gol} - {pegawai.jabatan_pegawai}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 italic">Tidak ada data pegawai</p>
                )}
              </div>
            </div>

            {surat.pengikut_list && surat.pengikut_list.length > 0 && (
              <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#5c7a54] mb-4 flex items-center gap-2">
                  <User size={20} /> Daftar Pengikut
                </h2>
                <div className="space-y-3">
                  {surat.pengikut_list.map((pengikut, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded border border-neutral-100">
                       <div>
                         <div className="font-medium text-neutral-900">{pengikut.nama}</div>
                         <div className="text-xs text-neutral-500">Lahir: {formatDate(pengikut.tgl_lahir)}</div>
                       </div>
                       <div className="text-sm text-neutral-600">{pengikut.keterangan}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
             <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                   <Hash size={18} /> Detail Dokumen
                </h2>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Nomor Surat</label>
                      <p className="text-neutral-900 font-mono bg-neutral-100 p-2 rounded mt-1 text-sm">{surat.nomor || '-'}</p>
                   </div>
                   <div>
                      <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Nomor SPD</label>
                      <p className="text-neutral-900 font-mono bg-neutral-100 p-2 rounded mt-1 text-sm">{surat.spd_nomor || '-'}</p>
                   </div>
                   <div>
                      <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Tanggal Surat</label>
                      <p className="text-neutral-900 mt-1">{formatDate(surat.tanggal_surat)}</p>
                   </div>
                   <div>
                      <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Dasar DIPA</label>
                      <p className="text-neutral-900 mt-1 text-sm">{surat.dasar_dipa || '-'}</p>
                   </div>
                   <div>
                      <label className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Penandatangan</label>
                      <p className="text-neutral-900 mt-1 text-sm">{surat.nama_dekan || '-'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
