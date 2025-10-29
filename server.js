// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db.config');
const suratRoutes = require('./routes/surat.routes');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
// ----------------------------------------------------
const corsOptions = {
  // Izinkan permintaan hanya dari alamat dan port frontend Anda (3001)
  origin: 'http://localhost:3001', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions)); // <-- Gunakan CORS dengan opsi
app.use(bodyParser.json());
// ----------------------------------------------------

// Panggil fungsi koneksi database
connectDB();

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Selamat datang di API Otomatisasi Surat Perjalanan Dinas." });
});

// Routes API
app.use('/api/surat', suratRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}.`);
});