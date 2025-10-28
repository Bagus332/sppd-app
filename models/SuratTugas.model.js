const { sequelize } = require('../db.config'); // <-- tambahkan ini
const { DataTypes } = require('sequelize');     // <-- tambahkan ini

const SuratTugas = sequelize.define('SuratTugas', {
    // Field untuk Nomor Surat
    nomor: { type: DataTypes.STRING, allowNull: false }, // [cite: 7, 21]

    // Field untuk Menimbang (Kegiatan)
    menimbang_kegiatan: { type: DataTypes.TEXT, allowNull: false }, // [cite: 9, 23]

    // Field untuk Dasar (DIPA)
    dasar_dipa: { type: DataTypes.STRING }, // [cite: 9, 23]
    dasar_dipa_tanggal: { type: DataTypes.DATEONLY }, // [cite: 9, 23]

    // Field untuk PEGAWAI (Contoh untuk satu pegawai, sesuaikan jika multiple)
    nama_pegawai: { type: DataTypes.STRING, allowNull: false }, // 
    nip_pegawai: { type: DataTypes.STRING, allowNull: false }, // 
    pangkat_gol: { type: DataTypes.STRING }, // 
    jabatan_pegawai: { type: DataTypes.STRING }, // 

    // Field untuk TUJUAN TUGAS
    tujuan_kegiatan: { type: DataTypes.TEXT, allowNull: false }, // [cite: 11, 25]
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: false }, // [cite: 11, 25]
    tanggal_selesai: { type: DataTypes.DATEONLY, allowNull: false }, // [cite: 11, 25]

    // Field untuk Tanda Tangan
    tanggal_surat: { type: DataTypes.DATEONLY, allowNull: false }, // [cite: 12, 26]
    nama_dekan: { type: DataTypes.STRING }, // [cite: 14, 28]

}, {
    tableName: 'surat_tugas',
    timestamps: true
});

module.exports = SuratTugas;