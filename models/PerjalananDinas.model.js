const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.config');

const PerjalananDinas = sequelize.define('PerjalananDinas', {
  nomor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dasar_dipa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal_surat: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nama_dekan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maksud_dinas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tgl_berangkat: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tgl_kembali: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  spd_nomor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ppk_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ppk_nip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pangkat_gol: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jabatan_instansi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tingkat_biaya: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  alat_angkut: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tempat_berangkat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tempat_tujuan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lama_hari: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pegawai_list: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  pengikut_list: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'perjalanan_dinas',
  timestamps: true,
});

module.exports = PerjalananDinas;
