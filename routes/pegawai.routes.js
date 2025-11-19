const express = require("express");
const router = express.Router();
const pegawaiController = require("../controllers/pegawai.controller");
const db = require("../db.config");
const { sequelize } = require("../db.config");


// === ROUTES CRUD PEGAWAI ===

// Ambil semua data pegawai
router.get("/", pegawaiController.getAllPegawai);

// Ambil satu data pegawai berdasarkan ID
router.get("/:id", pegawaiController.getPegawaiById);

// Simpan data pegawai baru
router.post("/", pegawaiController.createPegawai);

// Update data pegawai berdasarkan ID
router.put("/:id", pegawaiController.updatePegawai);

// Hapus data pegawai berdasarkan ID
router.delete("/:id", pegawaiController.deletePegawai);

// === ENDPOINT BARU: HITUNG TOTAL PEGAWAI ===
// === ENDPOINT BARU: HITUNG TOTAL PEGAWAI (Sequelize) ===
router.get("/count/all", async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM pegawai"
    );

    res.json({ total: results[0].total });
  } catch (error) {
    console.error("Error mengambil total pegawai:", error);
    res.status(500).json({ error: "Gagal mengambil total pegawai" });
  }
});

module.exports = router;
