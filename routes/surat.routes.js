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


// Export the router
module.exports = router;