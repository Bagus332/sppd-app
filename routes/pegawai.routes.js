// backend/routes/pegawai.routes.js
const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawai.controller');

// Simpan data pegawai ke database
router.post('/pegawai', pegawaiController.createPegawai);

// Ambil semua data pegawai
router.get('/pegawai', pegawaiController.getAllPegawai);

module.exports = router;
