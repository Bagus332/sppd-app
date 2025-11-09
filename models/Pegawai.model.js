// models/Pegawai.model.js

// Import Sequelize dan koneksi database
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.config'); 

// Definisi model Pegawai
const Pegawai = sequelize.define('pegawai', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tanggal_lahir: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nip: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  pangkat_golongan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  jabatan_instansi: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
}, {
  tableName: 'pegawai',
  timestamps: true, // ubah ke true kalau mau catat waktu otomatis
});

module.exports = Pegawai;
