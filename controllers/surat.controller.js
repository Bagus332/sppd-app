// controllers/surat.controller.js
const SuratTugas = require('../models/SuratTugas.model');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

exports.createSuratTugas = async (req, res) => {
    try {
        // 1. Simpan Data ke Database MySQL
        const dataSurat = await SuratTugas.create(req.body);

        // 2. Load Template Word
        const content = fs.readFileSync(
            // Pastikan path ini benar relatif terhadap posisi surat.controller.js
            // surat.controller.js berada di 'controllers', sehingga perlu '../' untuk keluar
            path.resolve(__dirname, '../templates/Template Surat Tugas (1).docx'), 
            'binary'
        );

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 3. Isi Data ke Template (Mapping Data)
        // Gunakan placeholder yang tepat di template Word, contoh: ${nomor}
        // Pastikan format tanggal sudah sesuai (contoh: Padang, 28 Oktober 2025)
        const tanggalSuratFormatted = new Date(dataSurat.tanggal_surat).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const tanggalMulaiFormatted = new Date(dataSurat.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
        const tanggalSelesaiFormatted = new Date(dataSurat.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });

        doc.setData({
            nomor: dataSurat.nomor,
            menimbang_kegiatan: dataSurat.menimbang_kegiatan,
            dasar_dipa: dataSurat.dasar_dipa,
            dasar_dipa_tanggal: new Date(dataSurat.dasar_dipa_tanggal).toLocaleDateString('id-ID'),
            nama_pegawai: dataSurat.nama_pegawai,
            nip_pegawai: dataSurat.nip_pegawai,
            pangkat_gol: dataSurat.pangkat_gol,
            jabatan_pegawai: dataSurat.jabatan_pegawai,
            tujuan_kegiatan: dataSurat.tujuan_kegiatan,
            tanggal_mulai: tanggalMulaiFormatted,
            tanggal_selesai: tanggalSelesaiFormatted,
            tanggal_surat: tanggalSuratFormatted, 
            nama_dekan: dataSurat.nama_dekan,
            // Perlu disiapkan untuk Multiple Pegawai jika menggunakan template kedua [cite: 25]
        });

        // 4. Proses Generasi Dokumen
        doc.render();

        // 5. Kirim File ke Klien
        const buffer = doc.getZip().generate({
            type: 'nodebuffer',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        // Set header untuk download
        res.setHeader('Content-Disposition', `attachment; filename="Surat Tugas_${dataSurat.nomor}.docx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Gagal membuat surat tugas", error: error.message });
    }
};