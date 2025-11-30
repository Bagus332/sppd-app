const jwt = require('jsonwebtoken');
const config = require('../db.config');

const verifyToken = (req, res, next) => {
  // Ambil token dari header atau cookie (biar lebih fleksibel)
  const token =
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.cookies?.token;

  if (!token) {
    return res.status(403).json({ message: 'Token tidak ditemukan. Silakan login kembali.' });
  }

  // Hapus prefix 'Bearer ' kalau ada
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  // Validate JWT_SECRET exists
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('CRITICAL: JWT_SECRET is not defined in environment variables!');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Verifikasi token
  jwt.verify(tokenString, jwtSecret, (err, decoded) => {
    if (err) {
      // Token invalid atau expired
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Sesi login sudah berakhir. Silakan login ulang.' });
      }
      return res.status(401).json({ message: 'Token tidak valid. Akses ditolak.' });
    }

    // Simpan data user ke request object (misal ID)
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };
