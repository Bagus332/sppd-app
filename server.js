// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db.config');
const suratRoutes = require('./routes/surat.routes');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// ----------------------------------------------------
const corsOptions = {
  // Izinkan permintaan dari frontend Next.js
  origin: 'http://localhost:3000',
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