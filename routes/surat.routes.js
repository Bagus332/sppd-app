// backend/routes/surat.routes.js
const express = require('express');
const router = express.Router();
const suratController = require('../controllers/surat.controller');

// GET semua surat
router.get('/', suratController.getAllSurat);

// GET surat berdasarkan ID
router.get('/:id', suratController.getSuratById);

// POST simpan perjalanan dinas
router.post('/simpan', suratController.perjalananDinas);

// POST buat surat tugas
router.post('/buat', suratController.createSuratTugas);

// DELETE surat
router.delete('/:id', suratController.deleteSurat);

module.exports = router;
