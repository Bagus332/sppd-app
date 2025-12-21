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
const perjalananRoutes = require("./routes/perjalanan.routes");
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
  next();
});

// =====================================================
// 🚏 ROUTES
// =====================================================

// Root route (cek koneksi API)
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di API Otomatisasi Surat Perjalanan Dinas 🚀',
    status: 'Running',
    env_check: {
        node_env: process.env.NODE_ENV,
        has_db_host: !!process.env.DB_HOST,
        has_db_user: !!process.env.DB_USER,
        has_db_pass: !!process.env.DB_PASSWORD,
    }
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

app.use("/api/perjalanan", perjalananRoutes);

app.use("/laporan", perjalananRoutes);


// =====================================================
// 🗄️ KONEKSI DATABASE DAN MENJALANKAN SERVER
// =====================================================

// Attempt to connect to DB, but don't crash if it fails (for Vercel debugging)
connectDB()
  .then(async () => {
    console.log('✅ Koneksi ke database berhasil.');
    // Membuat akun admin awal jika belum ada
    await createInitialAdmin();
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi ke database (Server tetap berjalan):', error.message);
    // Don't process.exit(1) on Vercel to allow logs/debug route to work
  });

// Jalankan server
if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
    });
}

module.exports = app;
