// controllers/surat.controller.js (Perubahan)

const SuratTugas = require('../models/SuratTugas.model');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

// Fungsi pembantu untuk memformat daftar pegawai menjadi list bernomor
const formatMultiPegawaiString = (pegawaiArray) => {
    if (!pegawaiArray || pegawaiArray.length === 0) return '';
    
    // Menggunakan array join dengan line break ('\n') — docxtemplater opsi linebreaks: true diperlukan
    const listItems = pegawaiArray.map((p, index) => {
        // Format: 1. Nama Pegawai / NIP Pegawai
        return `${index + 1}. ${p.nama_pegawai} / NIP ${p.nip_pegawai}`;
    });
    
    // Gabungkan dengan '\n' untuk membuat baris baru di dokumen
    return listItems.join('\n');
};

exports.createSuratTugas = async (req, res) => {
    try {
        // Menerima pegawai_list sebagai array dan data lainnya
        const { pegawai_list, ...restOfData } = req.body;
        
        // 1. Simpan Data ke Database MySQL
        const dataSurat = await SuratTugas.create({
            ...restOfData,
            pegawai_data: JSON.stringify(pegawai_list), // Simpan array pegawai
        });

        // 2. Load Template Word
        const content = fs.readFileSync(
            path.resolve(__dirname, '../templates/Template Surat Tugas (1).docx'), 
            'binary'
        );

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 3. Format Data untuk Template
        const tanggalSuratFormatted = new Date(restOfData.tanggal_surat).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const tanggalMulaiFormatted = new Date(restOfData.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
        const tanggalSelesaiFormatted = new Date(restOfData.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
        
        // **LOGIC KHUSUS UNTUK TEMPLATE MULTI-PEGAWAI (Halaman 2)**
        const pegawaiListString = formatMultiPegawaiString(pegawai_list || []);
        const firstPegawai = (pegawai_list && pegawai_list.length) ? pegawai_list[0] : {};

        doc.setData({
            nomor: restOfData.nomor,
            menimbang_kegiatan: restOfData.menimbang_kegiatan || '',
            dasar_dipa: restOfData.dasar_dipa || '',
            dasar_dipa_tanggal: restOfData.dasar_dipa_tanggal ? new Date(restOfData.dasar_dipa_tanggal).toLocaleDateString('id-ID') : '',
            
            // Isi placeholder pegawai tunggal dari pegawai pertama (jika ada)
            nama_pegawai: firstPegawai.nama_pegawai || '',
            nip_pegawai: firstPegawai.nip_pegawai || '',
            pangkat_gol: firstPegawai.pangkat_gol || '',
            jabatan_pegawai: firstPegawai.jabatan_pegawai || '',

            // Placeholder Khusus Multi-Pegawai (Halaman 2)
            pegawai_list_string: pegawaiListString,
            pegawai_count: (pegawai_list && pegawai_list.length) ? pegawai_list.length : 0,

            tujuan_kegiatan: restOfData.tujuan_kegiatan || '',
            tanggal_mulai: tanggalMulaiFormatted,
            tanggal_selesai: tanggalSelesaiFormatted,
            tanggal_surat: tanggalSuratFormatted,
            nama_dekan: restOfData.nama_dekan || '',
        });

        // 4. Proses Generasi Dokumen dan Respon
        doc.render();
        const buffer = doc.getZip().generate({ type: 'nodebuffer', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        res.setHeader('Content-Disposition', `attachment; filename="Surat Tugas_${restOfData.nomor}.docx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).send({ message: "Gagal membuat surat tugas", error: error.message });
    }
};