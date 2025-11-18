// backend/routes/surat.routes.js
const express = require('express');
const router = express.Router();
const suratController = require('../controllers/surat.controller');

// === CRUD Routes ===
// GET semua surat
router.get('/', suratController.getAllSurat);

// GET detail surat
router.get('/:id', suratController.getSuratById);

// POST simpan perjalanan dinas (Simpan ke DB)
router.post('/simpan', suratController.perjalananDinas);

// DELETE surat
router.delete('/:id', suratController.deleteSurat);

// === FEATURE Routes (Download) ===
// Download Surat Tugas (Word)
router.get('/:id/download/tugas', suratController.downloadSuratTugas);

// Download SPD (Word)
router.get('/:id/download/spd', suratController.downloadSPD);

module.exports = router;