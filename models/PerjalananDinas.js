const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.config');

const PerjalananDinas = sequelize.define('PerjalananDinas', {
// ----------------------------
// 📄 Bagian Administrasi Surat
// ----------------------------
nomor: {
type: DataTypes.STRING(100),
allowNull: true,
comment: 'Nomor surat tugas',
},
menimbang_kegiatan: {
type: DataTypes.TEXT,
allowNull: true,
},
dasar_dipa: {
type: DataTypes.STRING(255),
allowNull: true,
},
dasar_dipa_tanggal: {
type: DataTypes.DATEONLY,
allowNull: true,
},
tujuan_kegiatan: {
type: DataTypes.TEXT,
allowNull: true,
},
tanggal_mulai: {
type: DataTypes.DATEONLY,
allowNull: true,
},
tanggal_selesai: {
type: DataTypes.DATEONLY,
allowNull: true,
},

// ----------------------------
// 👥 Pegawai & Pengikut (JSON)
// ----------------------------
pegawai_list: {
type: DataTypes.TEXT,
allowNull: false,
comment: 'Array JSON pegawai',
get() {
const raw = this.getDataValue('pegawai_list');
try {
return JSON.parse(raw);
} catch {
return [];
}
},
set(value) {
this.setDataValue('pegawai_list', JSON.stringify(value));
},
},
pengikut_list: {
type: DataTypes.TEXT,
allowNull: true,
comment: 'Array JSON pengikut',
get() {
const raw = this.getDataValue('pengikut_list');
try {
return JSON.parse(raw);
} catch {
return [];
}
},
set(value) {
this.setDataValue('pengikut_list', JSON.stringify(value));
},
},

// ----------------------------
// 📝 SPD
// ----------------------------
spd_nomor: { type: DataTypes.STRING(100), allowNull: true },
ppk_name: { type: DataTypes.STRING(100), allowNull: true },
ppk_nip: { type: DataTypes.STRING(50), allowNull: true },
pangkat_gol: { type: DataTypes.STRING(50), allowNull: true },
jabatan_instansi: { type: DataTypes.STRING(100), allowNull: true },
tingkat_biaya: { type: DataTypes.STRING(50), allowNull: true },
maksud_dinas: { type: DataTypes.TEXT, allowNull: true },
alat_angkut: { type: DataTypes.STRING(50), allowNull: true },
tempat_berangkat: { type: DataTypes.STRING(100), allowNull: true },
tempat_tujuan: { type: DataTypes.STRING(100), allowNull: true },
lama_hari: { type: DataTypes.INTEGER, allowNull: true },
tgl_berangkat: { type: DataTypes.DATEONLY, allowNull: true },
tgl_kembali: { type: DataTypes.DATEONLY, allowNull: true },

// ----------------------------
//  Tanda Tangan & Validasi
// ----------------------------
tanggal_surat: { type: DataTypes.DATEONLY, allowNull: true },
nama_dekan: { type: DataTypes.STRING(100), allowNull: true },
}, {
tableName: 'perjalanan_dinas',
timestamps: true,
});

module.exports = PerjalananDinas;
