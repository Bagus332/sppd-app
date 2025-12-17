const express = require("express");
const router = express.Router();
const { sequelize } = require("../db.config");
const ExcelJS = require("exceljs");

// ================================
// GET total perjalanan dinas
// ================================
router.get("/count", async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM perjalanan_dinas"
    );
    res.json({ total: results[0].total });
  } catch (error) {
    console.error("Error mengambil total perjalanan:", error);
    res.status(500).json({ error: "Gagal mengambil total perjalanan" });
  }
});

// ================================
// Laporan SPD
// ================================
router.get("/spd", async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    let query = "SELECT * FROM perjalanan_dinas";
    const replacements = {};

    if (dari && sampai) {
      query += " WHERE tgl_berangkat BETWEEN :dari AND :sampai";
      replacements.dari = dari;
      replacements.sampai = sampai;
    } else if (dari) {
      query += " WHERE tgl_berangkat >= :dari";
      replacements.dari = dari;
    } else if (sampai) {
      query += " WHERE tgl_berangkat <= :sampai";
      replacements.sampai = sampai;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.json(results);
  } catch (error) {
    console.error("Error mengambil data SPD:", error);
    res.status(500).json({ error: "Gagal mengambil data SPD" });
  }
});

// ================================
// Export SPD ke Excel
// ================================
router.get("/spd/export", async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    let query = "SELECT * FROM perjalanan_dinas";
    const replacements = {};

    if (dari && sampai) {
      query += " WHERE tgl_berangkat BETWEEN :dari AND :sampai";
      replacements.dari = dari;
      replacements.sampai = sampai;
    } else if (dari) {
      query += " WHERE tgl_berangkat >= :dari";
      replacements.dari = dari;
    } else if (sampai) {
      query += " WHERE tgl_berangkat <= :sampai";
      replacements.sampai = sampai;
    }

    const [results] = await sequelize.query(query, { replacements });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan SPD");

    sheet.columns = [
      { header: "Nomor SPD", key: "spd_nomor", width: 20 },
      { header: "Pejabat Pembuat Komitmen (PPK)", key: "ppk_name", width: 20 },
      { header: "NIP PPK", key: "ppk_nip", width: 20 },

      { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
      { header: "NIP Pegawai", key: "nip_pegawai", width: 20 },
      { header: "Pangkat/Gol Pegawai", key: "pangkat_gol", width: 20 },
      { header: "Tanggal Lahir Pegawai", key: "tanggal_lahir", width: 20 },
      { header: "Jabatan Pegawai", key: "jabatan_pegawai", width: 20 },

      { header: "Nama Pengikut", key: "nama_pengikut", width: 20 },
      { header: "NIP Pengikut", key: "nip_pengikut", width: 20 },
      { header: "Pangkat/Gol Pengikut", key: "pangkat_pengikut", width: 20 },
      { header: "Tanggal Lahir Pengikut", key: "lahir_pengikut", width: 20 },
      { header: "Jabatan Pengikut", key: "jabatan_pengikut", width: 20 },

      { header: "Maksud Dinas", key: "maksud_dinas", width: 20 },
      { header: "Alat Angkut", key: "alat_angkut", width: 20 },
      { header: "Tempat Berangkat", key: "tempat_berangkat", width: 20 },
      { header: "Tempat Tujuan", key: "tempat_tujuan", width: 20 },
      { header: "Lama Perjalanan Dinas", key: "lama_hari", width: 20 },
      { header: "Tanggal Berangkat", key: "tgl_berangkat", width: 20 },
      { header: "Tanggal Kembali", key: "tgl_kembali", width: 20 },
      { header: "Tanggal SPD", key: "createdAt", width: 20 },
    ];

    results.forEach((s) => {
      // =======================
      // ✅ PEGAWAI
      // =======================
      const pegawai = Array.isArray(s.pegawai_list)
        ? s.pegawai_list[0]
        : s.pegawai_list;

      // =======================
      // ✅ PENGIKUT
      // =======================
      const pengikut = Array.isArray(s.pengikut_list)
        ? s.pengikut_list[0]
        : s.pengikut_list;

      sheet.addRow({
        spd_nomor: s.spd_nomor,

        // =======================
        // ✅ PPK
        // =======================
        ppk_name: s.ppk_name,
        ppk_nip: s.ppk_nip,

        // =======================
        // ✅ DATA PEGAWAI
        // =======================
        nama_pegawai: pegawai?.nama_pegawai || "-",
        nip_pegawai: pegawai?.nip_pegawai || "-",
        pangkat_gol: pegawai?.pangkat_gol || "-",
        tanggal_lahir: pegawai?.tanggal_lahir || "-",
        jabatan_pegawai: pegawai?.jabatan_pegawai || "-",

        // =======================
        // ✅ DATA PENGIKUT
        // =======================
        nama_pengikut: pengikut?.nama_pegawai || "-",
        nip_pengikut: pengikut?.nip_pegawai || "-",
        pangkat_pengikut: pengikut?.pangkat_gol || "-",
        lahir_pengikut: pengikut?.tanggal_lahir || "-",
        jabatan_pengikut: pengikut?.jabatan_pegawai || "-",

        // =======================
        // ✅ SPD UTAMA
        // =======================
        maksud_dinas: s.maksud_dinas,
        alat_angkut: s.alat_angkut,
        tempat_berangkat: s.tempat_berangkat,
        tempat_tujuan: s.tempat_tujuan,
        lama_hari: s.lama_hari,
        tgl_berangkat: s.tgl_berangkat,
        tgl_kembali: s.tgl_kembali,
        createdAt: s.createdAt,
      });
    });


    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Laporan_SPD.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal export SPD", error: err.message });
  }
});

// ================================
// Laporan Surat Tugas
// ================================
router.get("/surat-tugas", async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    let query = "SELECT * FROM perjalanan_dinas";
    const replacements = {};

    if (dari && sampai) {
      query += " WHERE tgl_berangkat BETWEEN :dari AND :sampai";
      replacements.dari = dari;
      replacements.sampai = sampai;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.json(results);
  } catch (error) {
    console.error("Error mengambil data Surat Tugas:", error);
    res.status(500).json({ error: "Gagal mengambil data Surat Tugas" });
  }
});

// ================================
// Export Surat Tugas ke Excel
// ================================
router.get("/surat-tugas/export", async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    let query = "SELECT * FROM perjalanan_dinas";
    const replacements = {};

    if (dari && sampai) {
      query += " WHERE tgl_berangkat BETWEEN :dari AND :sampai";
      replacements.dari = dari;
      replacements.sampai = sampai;
    }

    const [results] = await sequelize.query(query, { replacements });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Surat Tugas");

    sheet.columns = [
      { header: "Nomor Surat", key: "nomor", width: 20 },
      { header: "Dasar DIPA", key: "dasar_dipa", width: 20 },
      { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
      { header: "NIP Pegawai", key: "nip_pegawai", width: 20 },
      { header: "Pangkat/Gol", key: "pangkat_gol", width: 20 },
      { header: "Tanggal Lahir", key: "tanggal_lahir", width: 20 },
      { header: "Jabatan", key: "jabatan_pegawai", width: 20 },
      { header: "Maksud Dinas", key: "maksud_dinas", width: 20 },
      { header: "Tujuan", key: "tempat_tujuan", width: 20 },
      { header: "Tanggal Berangkat", key: "tgl_berangkat", width: 20 },
      { header: "Tanggal Kembali", key: "tgl_kembali", width: 20 },
      { header: "Tanggal Surat Tugas", key: "createdAt", width: 20 },
    ];

    results.forEach((s) => {
      const pegawai = Array.isArray(s.pegawai_list)
        ? s.pegawai_list[0]
        : s.pegawai_list;

      sheet.addRow({
        nomor: s.nomor,
        dasar_dipa: s.dasar_dipa,

        nama_pegawai: pegawai?.nama_pegawai || "-",
        nip_pegawai: pegawai?.nip_pegawai || "-",
        pangkat_gol: pegawai?.pangkat_gol || "-",
        tanggal_lahir: pegawai?.tanggal_lahir || "-",
        jabatan_pegawai: pegawai?.jabatan_pegawai || "-",

        maksud_dinas: s.maksud_dinas,
        tempat_tujuan: s.tempat_tujuan,
        tgl_berangkat: s.tgl_berangkat,
        tgl_kembali: s.tgl_kembali,
        createdAt: s.createdAt,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Laporan_Surat_Tugas.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal export Surat Tugas", error: err.message });
  }
});

module.exports = router;
