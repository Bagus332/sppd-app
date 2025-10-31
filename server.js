// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db.config');
const suratRoutes = require('./routes/surat.routes');
const authRoutes = require('./routes/auth.routes');
const { createInitialAdmin } = require('./controllers/auth.controller');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// ----------------------------------------------------
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Middleware untuk logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});
// ----------------------------------------------------

// Panggil fungsi koneksi database
connectDB();

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Selamat datang di API Otomatisasi Surat Perjalanan Dinas." });
});

// Routes API
app.use('/api/surat', suratRoutes);
app.use('/api/auth', authRoutes);

// Create initial admin user
createInitialAdmin();

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}.`);
});