// backend/controllers/surat.controller.js

const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const suratController = require('../controllers/surat.controller');
const db = require('../db.config');

// ===========================
// Fungsi bantu: format pegawai
// ===========================
const formatMultiPegawaiString = (pegawaiArray) => {
  if (!pegawaiArray || pegawaiArray.length === 0) return '';
  return pegawaiArray
    .map((p, i) => `${i + 1}. ${p.nama_pegawai} / NIP ${p.nip_pegawai}`)
    .join('\n');
};

// ===========================
// Generate Surat Tugas
// ===========================
exports.createSuratTugas = async (req, res) => {
  try {
    const { pegawai_list, nomor, dasar_dipa, tanggal_surat, nama_dekan, maksud_dinas, tgl_berangkat, tgl_kembali } = req.body;

    // Load template Surat Tugas
    const templatePath = path.resolve(__dirname, '../templates/Template Surat Tugas.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Format tanggal
    const tglSuratFormatted = tanggal_surat
      ? new Date(tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const tglBerangkatFormatted = tgl_berangkat
      ? new Date(tgl_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
      : '';
    const tglKembaliFormatted = tgl_kembali
      ? new Date(tgl_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
      : '';

    // Ambil pegawai pertama dan daftar
    const firstPegawai = pegawai_list?.[0] || {};
    const pegawaiListString = formatMultiPegawaiString(pegawai_list);

    // Set data untuk template
    doc.setData({
      nomor: nomor || '',
      dasar_dipa: dasar_dipa || '',
      nama_dekan: nama_dekan || '',
      maksud_dinas: maksud_dinas || '',
      tanggal_surat: tglSuratFormatted,
      tanggal_mulai: tglBerangkatFormatted,
      tanggal_selesai: tglKembaliFormatted,
      // Pegawai tunggal
      nama_pegawai: firstPegawai.nama_pegawai || '',
      nip_pegawai: firstPegawai.nip_pegawai || '',
      pangkat_gol: firstPegawai.pangkat_gol || '',
      jabatan_pegawai: firstPegawai.jabatan_pegawai || '',
      // Pegawai banyak (halaman 2)
      pegawai_list_string: pegawaiListString,
      pegawai_count: pegawai_list?.length || 0,
    });

    // Render dokumen
    doc.render();
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Kirim file
    res.setHeader('Content-Disposition', `attachment; filename="Surat_Tugas_${nomor || 'TanpaNomor'}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Surat Tugas Error:', error);
    res.status(500).send({ message: 'Gagal membuat surat tugas', error: error.message });
  }
};

// ===========================
// Generate SPD (Form PMK 113/PMK.05/2012)
// ===========================
exports.createSPD = async (req, res) => {
  try {
    const {
      spd_nomor,
      ppk_name,
      ppk_nip,
      pangkat_gol,
      jabatan_instansi,
      tingkat_biaya,
      maksud_dinas,
      alat_angkut,
      tempat_berangkat,
      tempat_tujuan,
      lama_hari,
      tgl_berangkat,
      tgl_kembali,
      pegawai_list,
      pengikut_list,
    } = req.body;

    // Load template SPD
    const templatePath = path.resolve(__dirname, '../templates/Form SPD FST (1).docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Format tanggal
    const tglDikeluarkan = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const tglBerangkatFormatted = tgl_berangkat
      ? new Date(tgl_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const tglKembaliFormatted = tgl_kembali
      ? new Date(tgl_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    const firstPegawai = pegawai_list?.[0] || {};

    // Format pengikut
    const pengikutData = (pengikut_list || []).map((p) => ({
      pengikut_nama: p.nama,
      pengikut_tgl_lahir: p.tgl_lahir
        ? new Date(p.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '',
      pengikut_ket: p.keterangan || '-',
    }));

    // Set data untuk template
    doc.setData({
      nomor: spd_nomor || '',
      ppk_name: ppk_name || '',
      ppk_nip: ppk_nip || '',
      pegawai_nama_nip: `${firstPegawai.nama_pegawai || ''} / NIP ${firstPegawai.nip_pegawai || ''}`,
      pangkat_gol: firstPegawai.pangkat_gol || pangkat_gol || '',
      jabatan_instansi: firstPegawai.jabatan_pegawai || jabatan_instansi || '',
      tingkat_biaya: tingkat_biaya || 'DIPA FST',
      maksud_dinas: maksud_dinas || '',
      alat_angkut: alat_angkut || '',
      tempat_berangkat: tempat_berangkat || 'Padang',
      tempat_tujuan: tempat_tujuan || '',
      lama_hari: lama_hari || '',
      tgl_berangkat: tglBerangkatFormatted,
      tgl_kembali: tglKembaliFormatted,
      tgl_dikeluarkan: tglDikeluarkan,
      pengikut_loop: pengikutData,
    });

    // Render dokumen
    doc.render();
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });



    // Kirim file
    res.setHeader('Content-Disposition', `attachment; filename="SPD_${spd_nomor || 'TanpaNomor'}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('SPD Controller Error:', error);
    res.status(500).send({ message: 'Gagal membuat dokumen SPD', error: error.message });
  }
};
 
// ===========================
// Simpan Data Perjalanan Dinas
// ===========================
exports.perjalananDinas = async (req, res) => {
  try {
    const data = req.body;

    // Simpan ke tabel menggunakan Sequelize Model
    await PerjalananDinas.create({
      nomor: data.spd_nomor || '', // sesuaikan dengan field di model
      menimbang_kegiatan: data.menimbang_kegiatan || '-',
      dasar_dipa: data.dasar_dipa || '',
      dasar_dipa_tanggal: data.dasar_dipa_tanggal || null,
      pegawai_data: JSON.stringify(data.pegawai_list || []),
      tujuan_kegiatan: data.maksud_dinas || '',
      tanggal_mulai: data.tgl_berangkat || null,
      tanggal_selesai: data.tgl_kembali || null,
      tanggal_surat: data.tanggal_surat || null,
      nama_dekan: data.nama_dekan || '',
    });

    res.status(200).json({ message: 'Data perjalanan dinas berhasil disimpan!' });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({
      message: 'Gagal menyimpan data perjalanan dinas',
      error: err.message,
    });
  }
};
