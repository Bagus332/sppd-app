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

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    return res.status(201).json({ message: "Registrasi berhasil!", user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

/**
 * LOGIN USER
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi." });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Password tidak valid!" });
    }

    // Generate JWT token (1 jam)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.secret || process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    // Simpan token di cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 jam
      path: "/",
    });

    return res.status(200).json({
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
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

/**
 * LOGOUT USER
 */
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", { path: "/" }); // hapus cookie JWT
    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat logout.' });
  }
};


/**
 * CEK STATUS LOGIN
 */
exports.checkAuth = (req, res) => {
  const token = req.cookies?.token || req.headers['authorization'];
  if (!token) {
    return res.status(200).json({ loggedIn: false });
  }

  try {
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(
      tokenString,
      config.secret || process.env.JWT_SECRET || 'secretkey'
    );
    return res.status(200).json({ loggedIn: true, userId: decoded.id });
  } catch (err) {
    return res.status(200).json({ loggedIn: false });
  }
};

/**
 * BUAT ADMIN DEFAULT
 */
exports.createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      });
      console.log('Initial admin user created successfully');
    }
  } catch (err) {
    console.error('Error creating initial admin:', err);
  }
};
