// models/SuratTugas.model.js
const { sequelize } = require('../db.config'); 
const { DataTypes } = require('sequelize');     

const SuratTugas = sequelize.define('SuratTugas', {
    // Field Administrasi
    nomor: { type: DataTypes.STRING, allowNull: false },
    menimbang_kegiatan: { type: DataTypes.TEXT, allowNull: false },
    dasar_dipa: { type: DataTypes.STRING },
    dasar_dipa_tanggal: { type: DataTypes.DATEONLY },

    // FIELD BARU: Menggantikan nama_pegawai, nip_pegawai, dll.
    // Menyimpan data multi-pegawai sebagai string JSON.
    pegawai_data: { 
        type: DataTypes.TEXT, 
        allowNull: false, // Wajib diisi (minimal satu pegawai)
        comment: 'JSON string array of employee objects'
    }, 

    // Field Tujuan Tugas
    tujuan_kegiatan: { type: DataTypes.TEXT, allowNull: false },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: false },
    tanggal_selesai: { type: DataTypes.DATEONLY, allowNull: false },

    // Field Tanda Tangan
    tanggal_surat: { type: DataTypes.DATEONLY, allowNull: false },
    nama_dekan: { type: DataTypes.STRING, allowNull: false }, // Pastikan ini juga allowNull: false jika wajib

}, {
    tableName: 'surat_tugas',
    timestamps: true
});

module.exports = SuratTugas;