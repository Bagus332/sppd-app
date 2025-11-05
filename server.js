// server.js
require('dotenv').config(); // Load .env paling awal
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db.config');
const suratRoutes = require('./routes/surat.routes');
const authRoutes = require('./routes/auth.routes');
const { createInitialAdmin } = require('./controllers/auth.controller');

const app = express();
const PORT = process.env.PORT || 8080;

// ------------------- Middleware -------------------

// Konfigurasi CORS agar bisa diakses dari frontend (Next.js)
const corsOptions = {
  origin: 'http://localhost:3000', // URL frontend kamu
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logging (diperkuat agar tidak error)
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);

  try {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    } else {
      console.log('Body: (kosong)');
    }
  } catch (err) {
    console.warn('⚠️ Tidak dapat membaca body:', err.message);
  }

  next();
});

// --------------------------------------------------

// ------------------- Routes -------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di API Otomatisasi Surat Perjalanan Dinas.',
  });
});

// Route utama
app.use('/api/surat', suratRoutes);
app.use('/api/auth', authRoutes);

// --------------------------------------------------

// ------------------- Koneksi Database -------------------
connectDB()
  .then(() => {
    console.log('✅ Koneksi database berhasil.');

    // Buat akun admin awal (jika belum ada)
    createInitialAdmin();

    // Jalankan server setelah koneksi DB berhasil
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Gagal koneksi ke database:', error.message);
    process.exit(1);
  });
// --------------------------------------------------
