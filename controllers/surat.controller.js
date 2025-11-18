// backend/controllers/surat.controller.js
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const PerjalananDinas = require('../models/PerjalananDinas.model');

// ===========================
// 🛠️ HELPER FUNCTIONS
// ===========================

/**
 * Format tanggal ke format Indonesia (dd MMMM yyyy)
 */
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Fungsi generik untuk generate dan kirim file DOCX
 */
const generateAndSendDocx = (res, templateName, data, outputFilename) => {
  try {
    const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} tidak ditemukan di sistem.`);
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Render data ke template
    doc.setData(data);
    doc.render();

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Set header dan kirim file
    const safeFilename = outputFilename.replace(/[\/\\:*?"<>|]/g, '-'); // Sanitize filename
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);

  } catch (error) {
    console.error(`Error generating ${templateName}:`, error);
    res.status(500).json({ message: 'Gagal membuat dokumen', error: error.message });
  }
};


// ===========================
// 🎮 MAIN CONTROLLER ACTIONS
// ===========================

/**
 * Simpan Data Perjalanan Dinas (Create)
 */
exports.perjalananDinas = async (req, res) => {
  try {
    // Destructure untuk keamanan input (whitelist)
    const { 
      pegawai_list, pengikut_list, nomor, dasar_dipa, tanggal_surat, nama_dekan,
      maksud_dinas, tgl_berangkat, tgl_kembali, spd_nomor, ppk_name, ppk_nip,
      pangkat_gol, jabatan_instansi, tingkat_biaya, alat_angkut,
      tempat_berangkat, tempat_tujuan, lama_hari
    } = req.body;

    const perjalanan = await PerjalananDinas.create({
      pegawai_list: pegawai_list || [],
      pengikut_list: pengikut_list || [],
      nomor, dasar_dipa, tanggal_surat, nama_dekan, maksud_dinas,
      tgl_berangkat, tgl_kembali, spd_nomor, ppk_name, ppk_nip,
      pangkat_gol, jabatan_instansi, tingkat_biaya, alat_angkut,
      tempat_berangkat, tempat_tujuan, lama_hari
    });

    return res.status(201).json({ 
      message: 'Data perjalanan dinas berhasil disimpan',
      data: perjalanan 
    });

  } catch (err) {
    console.error('❌ Error simpan perjalanan dinas:', err);
    return res.status(500).json({ message: 'Gagal menyimpan data', error: err.message });
  }
};

/**
 * Generate & Download Surat Tugas by ID
 */
exports.downloadSuratTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await PerjalananDinas.findByPk(id);

    if (!surat) return res.status(404).json({ message: 'Data surat tidak ditemukan' });

    const pegawaiList = surat.pegawai_list || [];
    const isMulti = pegawaiList.length > 1;

    // Siapkan Data untuk Template
    const data = {
      nomor: surat.nomor || '',
      menimbang_kegiatan: surat.maksud_dinas || '',
      dasar_dipa: surat.dasar_dipa || '',
      dasar_dipa_tanggal: '...', // Opsional: Bisa ambil dari DB jika ada kolomnya
      tujuan_kegiatan: surat.maksud_dinas || '',
      tanggal_mulai: formatDate(surat.tgl_berangkat),
      tanggal_selesai: formatDate(surat.tgl_kembali),
      tanggal_surat: formatDate(surat.tanggal_surat),
      nama_dekan: surat.nama_dekan || '',
    };

    // Logika pemilihan template
    if (isMulti) {
      // Template Multi Pegawai
      data.pegawai_list_string = pegawaiList
        .map((p, i) => `${i + 1}. ${p.nama_pegawai} / NIP ${p.nip_pegawai}`)
        .join('\n');
      
      generateAndSendDocx(res, 'Template Surat Tugas (2).docx', data, `Surat_Tugas_${surat.nomor}.docx`);
    } else {
      // Template Single Pegawai
      const p = pegawaiList[0] || {};
      data.nama_pegawai = p.nama_pegawai || '';
      data.nip_pegawai = p.nip_pegawai || '';
      data.pangkat_gol = p.pangkat_gol || '';
      data.jabatan_pegawai = p.jabatan_pegawai || '';

      generateAndSendDocx(res, 'Template Surat Tugas (1).docx', data, `Surat_Tugas_${surat.nomor}.docx`);
    }

  } catch (error) {
    console.error('Download Tugas Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

/**
 * Generate & Download SPD by ID
 */
exports.downloadSPD = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await PerjalananDinas.findByPk(id);

    if (!surat) return res.status(404).json({ message: 'Data surat tidak ditemukan' });

    const firstPegawai = (surat.pegawai_list && surat.pegawai_list[0]) || {};
    
    // Mapping data pengikut
    const pengikutData = (surat.pengikut_list || []).map((p) => ({
      pengikut_nama: p.nama,
      pengikut_tgl_lahir: formatDate(p.tgl_lahir),
      pengikut_ket: p.keterangan || '-',
    }));

    const data = {
      spd_nomor: surat.spd_nomor || '',
      ppk_name: surat.ppk_name || '',
      ppk_nip: surat.ppk_nip || '',
      pegawai_nama_nip: `${firstPegawai.nama_pegawai || ''} / NIP ${firstPegawai.nip_pegawai || ''}`,
      pangkat_gol: firstPegawai.pangkat_gol || surat.pangkat_gol || '',
      jabatan_instansi: firstPegawai.jabatan_pegawai || surat.jabatan_instansi || '',
      tingkat_biaya: surat.tingkat_biaya || 'DIPA FST',
      maksud_dinas: surat.maksud_dinas || '',
      alat_angkut: surat.alat_angkut || '',
      tempat_berangkat: surat.tempat_berangkat || 'Padang',
      tempat_tujuan: surat.tempat_tujuan || '',
      lama_hari: surat.lama_hari || '',
      tgl_berangkat: formatDate(surat.tgl_berangkat),
      tgl_kembali: formatDate(surat.tgl_kembali),
      tgl_dikeluarkan: formatDate(surat.tanggal_surat || new Date()),
      pengikut_loop: pengikutData,
    };

    generateAndSendDocx(res, 'Form SPD FST (1).docx', data, `SPD_${surat.spd_nomor || 'Draft'}.docx`);

  } catch (error) {
    console.error('Download SPD Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

/**
 * Ambil Semua Surat (Read All)
 */
exports.getAllSurat = async (req, res) => {
  try {
    const surats = await PerjalananDinas.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(surats);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data surat' });
  }
};

/**
 * Ambil Surat by ID (Read One)
 */
exports.getSuratById = async (req, res) => {
  try {
    const surat = await PerjalananDinas.findByPk(req.params.id);
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.status(200).json(surat);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail surat' });
  }
};

/**
 * Hapus Surat (Delete)
 */
exports.deleteSurat = async (req, res) => {
  try {
    const surat = await PerjalananDinas.findByPk(req.params.id);
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    
    await surat.destroy();
    res.status(200).json({ message: 'Surat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus surat' });
  }
};