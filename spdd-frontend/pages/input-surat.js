// pages/input-surat.js
import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function InputSurat() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomor: '',
    menimbang_kegiatan: '',
    dasar_dipa: '',
    dasar_dipa_tanggal: '',
    nama_pegawai: '',
    nip_pegawai: '',
    pangkat_gol: '',
    jabatan_pegawai: '',
    tujuan_kegiatan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    tanggal_surat: new Date().toISOString().substring(0, 10), // Default hari ini
    nama_dekan: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // POST data ke Express.js API
      const response = await axios.post('http://localhost:4000/api/surat/buat', formData, {
        responseType: 'blob', // Penting untuk menerima file .docx sebagai blob
      });

      // 1. Membuat URL Objek dari blob respons
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // 2. Membuat link download
      const link = document.createElement('a');
      link.href = url;
      
      // Mengambil nama file dari header Content-Disposition (jika ada)
      const disposition = response.headers['content-disposition'];
      let filename = 'Surat_Tugas_Baru.docx';
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
          }
      }
      
      link.setAttribute('download', filename);

      // 3. Memicu download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setMessage('Surat Tugas berhasil dibuat dan diunduh!');
      router.push('/dashboard'); // Kembali ke dashboard setelah sukses
      
    } catch (error) {
      console.error('Gagal membuat surat:', error);
      setMessage(`Gagal membuat surat: ${error.message}. Pastikan semua field terisi benar.`);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: "Nomor Surat", name: "nomor", type: "text" },
    { label: "Kegiatan (Menimbang)", name: "menimbang_kegiatan", type: "textarea" },
    { label: "Sumber DIPA", name: "dasar_dipa", type: "text" },
    { label: "Tanggal DIPA", name: "dasar_dipa_tanggal", type: "date" },
    { label: "Nama Pegawai", name: "nama_pegawai", type: "text" },
    { label: "NIP Pegawai", name: "nip_pegawai", type: "text" },
    { label: "Pangkat/Golongan", name: "pangkat_gol", type: "text" },
    { label: "Jabatan Pegawai", name: "jabatan_pegawai", type: "text" },
    { label: "Rincian Tugas (Untuk)", name: "tujuan_kegiatan", type: "textarea" },
    { label: "Tanggal Mulai", name: "tanggal_mulai", type: "date" },
    { label: "Tanggal Selesai", name: "tanggal_selesai", type: "date" },
    { label: "Tanggal Surat Dibuat", name: "tanggal_surat", type: "date" },
    { label: "Nama Dekan (Tanda Tangan)", name: "nama_dekan", type: "text" },
  ];

  return (
    <>
      <Head>
        <title>Input Surat Tugas</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Formulir Pembuatan Surat Tugas</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows="3"
                      required
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      required
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {message && (
              <p className={`text-center py-3 rounded-md ${message.includes('Gagal') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Membuat Surat...' : 'Generate & Download Surat Tugas'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}