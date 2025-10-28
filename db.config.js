// db.config.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Untuk memuat variabel dari .env

// Inisialisasi Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nama Database
    process.env.DB_USER,      // User Database
    process.env.DB_PASSWORD,  // Password Database
    {
        host: process.env.DB_HOST, // Host Database (misalnya 'localhost')
        dialect: 'mysql',          // Tipe Database
        logging: false,            // Matikan logging query SQL untuk membersihkan console
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Fungsi untuk menguji koneksi database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Koneksi ke MySQL berhasil.');

        // Sinkronisasi semua model (membuat tabel jika belum ada)
        // Gunakan { force: true } HANYA saat pengembangan, karena akan menghapus dan membuat ulang tabel
        await sequelize.sync();
        console.log('Semua model telah disinkronkan!');

    } catch (error) {
        console.error('Koneksi ke MySQL gagal:', error.message);
        // Keluar dari proses jika koneksi gagal
        process.exit(1); 
    }
};

module.exports = {
    sequelize,
    connectDB
};