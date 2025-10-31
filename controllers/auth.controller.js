const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const config = require('../db.config');

/**
 * REGISTER USER BARU
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi sederhana
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Semua field wajib diisi." });
    }

    // Cek apakah email atau username sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "Email sudah terdaftar." });
    }

    // Buat user baru
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role: role || 'user',
    });

    res.status(201).send({ message: "Registrasi berhasil!", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send({ message: "Terjadi kesalahan server." });
  }
};

/**
 * LOGIN USER
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek data input
    if (!username || !password) {
      return res.status(400).send({ message: "Username dan password wajib diisi." });
    }

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan." });
    }

    // Verifikasi password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Password tidak valid!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.secret,
      { expiresIn: 86400 } // 24 jam
    );

    // Simpan token di cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ubah ke true jika pakai HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
      path: "/",
    });

    // Kirim respon sukses ke frontend
    res.status(200).send({
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ message: "Terjadi kesalahan server." });
  }
};

/**
 * BUAT ADMIN DEFAULT (JIKA BELUM ADA)
 */
exports.createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 8),
        role: 'admin',
      });
      console.log('Initial admin user created successfully');
    }
  } catch (err) {
    console.error('Error creating initial admin:', err);
  }
};
