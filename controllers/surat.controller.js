// backend/controllers/surat.controller.js
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');
const PerjalananDinas = require('../models/PerjalananDinas.model');

// ... (Helper functions: formatDate, generateAndSendDocx tetap sama)
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const generateAndSendDocx = (res, templateName, data, outputFilename) => {
    // ... (kode helper generateAndSendDocx sama seperti sebelumnya)
    try {
        const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
        if (!fs.existsSync(templatePath)) throw new Error(`Template ${templateName} tidak ditemukan.`);

        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        doc.setData(data);
        doc.render();

        const buffer = doc.getZip().generate({
            type: 'nodebuffer',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const safeFilename = outputFilename.replace(/[\/\\:*?"<>|]/g, '-');
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
 * Generate & Download Surat Tugas
 */
exports.downloadSuratTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await PerjalananDinas.findByPk(id);
    if (!surat) return res.status(404).json({ message: 'Data surat tidak ditemukan' });

    const pegawaiList = surat.pegawai_list || [];
    const isMulti = pegawaiList.length > 1;

    const data = {
      nomor: surat.nomor || '',
      menimbang_kegiatan: surat.maksud_dinas || '',
      dasar_dipa: surat.dasar_dipa || '',
      dasar_dipa_tanggal: '...', 
      tujuan_kegiatan: surat.maksud_dinas || '',
      tanggal_mulai: formatDate(surat.tgl_berangkat),
      tanggal_selesai: formatDate(surat.tgl_kembali),
      tanggal_surat: formatDate(surat.tanggal_surat),
      nama_dekan: surat.nama_dekan || '',
    };

    if (isMulti) {
      data.pegawai_list_string = pegawaiList
        .map((p, i) => `${i + 1}. ${p.nama_pegawai} / NIP ${p.nip_pegawai}`)
        .join('\n');
      generateAndSendDocx(res, 'Template Surat Tugas (2).docx', data, `Surat_Tugas_${surat.nomor}.docx`);
    } else {
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
 * Logic Update: PPK dari Pegawai #1, Pengikut punya Tanggal Lahir
 */
exports.downloadSPD = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await PerjalananDinas.findByPk(id);

    if (!surat) return res.status(404).json({ message: 'Data surat tidak ditemukan' });

    const allPegawai = surat.pegawai_list || [];
    const ketua = allPegawai[0] || {};
    
    // Ambil sisa anggota untuk tabel pengikut (dengan TANGGAL LAHIR)
    const sisaAnggota = allPegawai.slice(1).map((p) => ({
      pengikut_nama: p.nama_pegawai,
      // Gunakan field tanggal_lahir dari pegawai_list yang baru ditambahkan
      pengikut_tgl_lahir: p.tanggal_lahir ? formatDate(p.tanggal_lahir) : '-',
      pengikut_ket: p.jabatan_pegawai || `NIP: ${p.nip_pegawai}`,
    }));

    const pengikutMurni = (surat.pengikut_list || []).map((p) => ({
      pengikut_nama: p.nama,
      pengikut_tgl_lahir: formatDate(p.tgl_lahir),
      pengikut_ket: p.keterangan || '-',
    }));

    const finalPengikutData = [...sisaAnggota, ...pengikutMurni];

    const data = {
      spd_nomor: surat.spd_nomor || '',
      ppk_name: ketua.nama_pegawai || '', 
      ppk_nip: ketua.nip_pegawai || '',
      pegawai_nama_nip: `${ketua.nama_pegawai || ''} / NIP ${ketua.nip_pegawai || ''}`,
      pangkat_gol: ketua.pangkat_gol || surat.pangkat_gol || '',
      jabatan_instansi: ketua.jabatan_pegawai || surat.jabatan_instansi || '',
      tingkat_biaya: surat.tingkat_biaya || 'DIPA FST',
      maksud_dinas: surat.maksud_dinas || '',
      alat_angkut: surat.alat_angkut || '',
      tempat_berangkat: surat.tempat_berangkat || 'Padang',
      tempat_tujuan: surat.tempat_tujuan || '',
      lama_hari: surat.lama_hari || '',
      tgl_berangkat: formatDate(surat.tgl_berangkat),
      tgl_kembali: formatDate(surat.tgl_kembali),
      tgl_dikeluarkan: formatDate(surat.tanggal_surat || new Date()),
      pengikut_loop: finalPengikutData,
    };

    generateAndSendDocx(res, 'Form SPD FST (1).docx', data, `SPD_${surat.spd_nomor || 'Draft'}.docx`);

  } catch (error) {
    console.error('Download SPD Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

/**
 * Simpan Data Perjalanan Dinas (Create)
 * Update: ppk_name/nip di DB diisi otomatis dari pegawai pertama
 */
exports.perjalananDinas = async (req, res) => {
  try {
    const { 
      pegawai_list, pengikut_list, nomor, dasar_dipa, tanggal_surat, nama_dekan,
      maksud_dinas, tgl_berangkat, tgl_kembali, spd_nomor,
      pangkat_gol, jabatan_instansi, tingkat_biaya, alat_angkut,
      tempat_berangkat, tempat_tujuan, lama_hari
    } = req.body;

    // Logika PPK otomatis: Ambil dari pegawai pertama
    let finalPPKName = '';
    let finalPPKNip = '';

    if (pegawai_list && pegawai_list.length > 0) {
        finalPPKName = pegawai_list[0].nama_pegawai;
        finalPPKNip = pegawai_list[0].nip_pegawai;
    }

    const perjalanan = await PerjalananDinas.create({
      pegawai_list: pegawai_list || [],
      pengikut_list: pengikut_list || [],
      nomor, dasar_dipa, tanggal_surat, nama_dekan, maksud_dinas,
      tgl_berangkat, tgl_kembali, spd_nomor, 
      ppk_name: finalPPKName, // Otomatis
      ppk_nip: finalPPKNip,   // Otomatis
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

// ... (fungsi getAllSurat, getSuratById, deleteSurat tetap sama)
exports.getAllSurat = async (req, res) => {
  try {
    const surats = await PerjalananDinas.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(surats);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
};

exports.getSuratById = async (req, res) => {
  try {
    const surat = await PerjalananDinas.findByPk(req.params.id);
    if (!surat) return res.status(404).json({ message: 'Not Found' });
    res.status(200).json(surat);
  } catch (err) { res.status(500).json({ message: 'Error' }); }
};

exports.deleteSurat = async (req, res) => {
  try {
    const surat = await PerjalananDinas.findByPk(req.params.id);
    if (!surat) return res.status(404).json({ message: 'Not Found' });
    await surat.destroy();
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Error' }); }
};

const ExcelJS = require('exceljs');

exports.exportSPDToExcel = async (req, res) => {
  try {
    const spds = await PerjalananDinas.findAll({ order: [['tgl_berangkat', 'DESC']] });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan SPD');

    // Header
    sheet.columns = [
      { header: 'Nomor SPD', key: 'nomor_spd', width: 20 },
      { header: 'Nama Pegawai', key: 'nama_pegawai', width: 30 },
      { header: 'Tujuan', key: 'tujuan', width: 30 },
      { header: 'Tanggal Berangkat', key: 'tgl_berangkat', width: 20 },
      { header: 'Tanggal Kembali', key: 'tgl_kembali', width: 20 },
      { header: 'Keterangan', key: 'keterangan', width: 30 },
    ];

    // Isi data
    spds.forEach((s) => {
      sheet.addRow({
        nomor_spd: s.spd_nomor,
        nama_pegawai: s.pegawai_list?.[0]?.nama_pegawai || '',
        tujuan: s.tujuan || s.maksud_dinas,
        tgl_berangkat: s.tgl_berangkat,
        tgl_kembali: s.tgl_kembali,
        keterangan: s.keterangan || '',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'Laporan_SPD.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal export SPD', error: err.message });
  }
};
