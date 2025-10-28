// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db.config');
const suratRoutes = require('./routes/surat.routes');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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