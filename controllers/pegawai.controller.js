const Pegawai = require('../models/Pegawai.model');

// Ambil semua pegawai
exports.getAllPegawai = async (req, res) => {
  try {
    const pegawai = await Pegawai.findAll();
    res.json(pegawai);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pegawai', error });
  }
};

// Tambah pegawai baru
exports.createPegawai = async (req, res) => {
  try {
    const { nama, tanggal_lahir, nip, pangkat_golongan, jabatan_instansi } = req.body;

    const newPegawai = await Pegawai.create({
      nama,
      tanggal_lahir,
      nip,
      pangkat_golongan,
      jabatan_instansi,
    });

    res.status(201).json(newPegawai);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambah data pegawai', error });
  }
};
