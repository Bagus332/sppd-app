const express = require("express");
const router = express.Router();
const pegawaiController = require("../controllers/pegawai.controller");
const { verifyToken } = require('../middleware/auth.middleware');

// === ROUTES CRUD PEGAWAI (Protected) ===

// Ambil semua data pegawai
router.get("/", verifyToken, pegawaiController.getAllPegawai);

// Ambil satu data pegawai berdasarkan ID
router.get("/:id", verifyToken, pegawaiController.getPegawaiById);

// Simpan data pegawai baru
router.post("/", verifyToken, pegawaiController.createPegawai);

// Update data pegawai berdasarkan ID
router.put("/:id", verifyToken, pegawaiController.updatePegawai);

// Hapus data pegawai berdasarkan ID
router.delete("/:id", verifyToken, pegawaiController.deletePegawai);

module.exports = router;
