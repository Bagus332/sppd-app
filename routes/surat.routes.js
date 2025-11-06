// backend/routes/surat.routes.js
const express = require('express');
const router = express.Router();
const suratController = require('../controllers/surat.controller');

/**
 * ROUTES UNTUK GENERATE SURAT
 * ---------------------------
 * Semua endpoint di bawah ini menghasilkan file .docx
 * (tidak disimpan ke database, hanya diunduh)
 */

router.post('/buat', suratController.createSuratTugas);
router.post('/spd/buat', suratController.createSPD);

router.post('/simpan', suratController.perjalananDinas);

// Generate Surat Tugas (.docx)
router.post('/generate-surat-tugas', suratController.createSuratTugas);

// Generate SPD (.docx)
router.post('/generate-spd', suratController.createSPD);

module.exports = router;
