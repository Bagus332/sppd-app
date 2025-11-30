// backend/server.js
require('dotenv').config(); // Load variabel lingkungan (.env) paling awal
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db.config');
const { createInitialAdmin } = require('./controllers/auth.controller');

// Import routes
const suratRoutes = require('./routes/surat.routes');
const authRoutes = require('./routes/auth.routes');
const pegawaiRoutes = require('./routes/pegawai.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// =====================================================
// 🧩 MIDDLEWARE UTAMA
// =====================================================

// Konfigurasi CORS agar API dapat diakses dari frontend (Next.js)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Parsing request body JSON dan form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware logging sederhana untuk debugging
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  } else {
    console.log('Body: (kosong)');
  }
  next();
});

// =====================================================
// 🚏 ROUTES
// =====================================================

// Root route (cek koneksi API)
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di API Otomatisasi Surat Perjalanan Dinas 🚀',
  });
});

//  route pegawai
app.use('/api/pegawai', pegawaiRoutes);

// Route surat tugas & SPD
app.use('/api/surat', suratRoutes);

// Route autentikasi (register, login, logout)
app.use('/api/auth', authRoutes);

// Route dashboard statistics
app.use('/api/dashboard', dashboardRoutes);

// =====================================================
// 🗄️ KONEKSI DATABASE DAN MENJALANKAN SERVER
// =====================================================

connectDB()
  .then(async () => {
    console.log('✅ Koneksi ke database berhasil.');

    // Membuat akun admin awal jika belum ada
    await createInitialAdmin();

    // Jalankan server setelah database terkoneksi
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi ke database:', error.message);
    process.exit(1);
  });
