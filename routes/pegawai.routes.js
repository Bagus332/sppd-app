const express = require("express");
const router = express.Router();
const pegawaiController = require("../controllers/pegawai.controller");

// === ROUTES CRUD PEGAWAI ===


router.get("/", pegawaiController.getAllPegawai);
router.get("/:id", pegawaiController.getPegawaiById);
router.post("/", pegawaiController.createPegawai);
router.put("/:id", pegawaiController.updatePegawai);
router.delete("/:id", pegawaiController.deletePegawai);

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

module.exports = router;
