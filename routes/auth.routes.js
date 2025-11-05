const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ---------------- ROUTES AUTENTIKASI ----------------

// Registrasi pengguna baru
router.post('/register', authController.register);

// Login pengguna
router.post('/login', authController.login);

// Logout pengguna
router.post('/logout', authController.logout);

// Cek status autentikasi (token masih valid atau tidak)
router.get('/check', authController.checkAuth);

module.exports = router;
