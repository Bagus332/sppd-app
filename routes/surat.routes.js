// routes/surat.routes.js
const express = require ('express');
const router = express.Router();
const suratController = require('../controllers/surat.controller');


/**
 * @route POST /api/surat/buat
 * @desc Membuat data Surat Tugas baru dan menghasilkan file .docx
 * @access Public (atau Private, tergantung kebutuhan autentikasi)
 */
router.post('/buat', suratController.createSuratTugas);

/**
 * @route GET /api/surat
 * @desc Mendapatkan semua data Surat Tugas yang tersimpan
 * @access Public (atau Private)
 */
router.get('/', suratController.findAllSuratTugas);

/**
 * @route GET /api/surat/:id
 * @desc Mendapatkan detail Surat Tugas berdasarkan ID
 * @access Public (atau Private)
 */
router.get('/:id', suratController.findOneSuratTugas);


module.exports = router;