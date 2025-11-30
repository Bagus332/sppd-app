// backend/routes/surat.routes.js
const express = require('express');
const router = express.Router();
const suratController = require('../controllers/surat.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// === CRUD Routes (Protected) ===
// GET semua surat
router.get('/', verifyToken, suratController.getAllSurat);

// GET detail surat
router.get('/:id', verifyToken, suratController.getSuratById);

// POST simpan perjalanan dinas (Simpan ke DB)
router.post('/simpan', verifyToken, suratController.perjalananDinas);

// DELETE surat
router.delete('/:id', verifyToken, suratController.deleteSurat);

// === FEATURE Routes (Download - Protected) ===
// Download Surat Tugas (Word)
router.get('/:id/download/tugas', verifyToken, suratController.downloadSuratTugas);

// Download SPD (Word)
router.get('/:id/download/spd', verifyToken, suratController.downloadSPD);

module.exports = router;