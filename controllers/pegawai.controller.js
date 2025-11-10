const Pegawai = require("../models/Pegawai.model");

// === Ambil semua pegawai ===
exports.getAllPegawai = async (req, res) => {
  try {
    const pegawai = await Pegawai.findAll();
    res.status(200).json(pegawai);
  } catch (error) {
    console.error("❌ Gagal mengambil data pegawai:", error);
    res.status(500).json({ message: "Gagal mengambil data pegawai", error });
  }
};

// === Ambil pegawai berdasarkan ID ===
exports.getPegawaiById = async (req, res) => {
  try {
    const { id } = req.params;
    const pegawai = await Pegawai.findByPk(id);

    if (!pegawai) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    res.status(200).json(pegawai);
  } catch (error) {
    console.error("❌ Gagal mengambil data pegawai berdasarkan ID:", error);
    res.status(500).json({ message: "Gagal mengambil data pegawai", error });
  }
};

// === Tambah pegawai baru ===
exports.createPegawai = async (req, res) => {
  try {
    const { nama, tanggal_lahir, nip, pangkat_golongan, jabatan_instansi } = req.body;

    if (!nama || !tanggal_lahir || !nip || !pangkat_golongan || !jabatan_instansi) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const newPegawai = await Pegawai.create({
      nama,
      tanggal_lahir,
      nip,
      pangkat_golongan,
      jabatan_instansi,
    });

    res.status(201).json({
      message: "Pegawai berhasil ditambahkan",
      data: newPegawai,
    });
  } catch (error) {
    console.error("❌ Gagal menambah data pegawai:", error);
    res.status(500).json({ message: "Gagal menambah data pegawai", error });
  }
};

// === Update pegawai berdasarkan ID ===
exports.updatePegawai = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, tanggal_lahir, nip, pangkat_golongan, jabatan_instansi } = req.body;

    const pegawai = await Pegawai.findByPk(id);
    if (!pegawai) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    await pegawai.update({
      nama,
      tanggal_lahir,
      nip,
      pangkat_golongan,
      jabatan_instansi,
    });

    res.status(200).json({
      message: "Pegawai berhasil diperbarui",
      data: pegawai,
    });
  } catch (error) {
    console.error("❌ Gagal mengupdate data pegawai:", error);
    res.status(500).json({ message: "Gagal mengupdate data pegawai", error });
  }
};

// === Hapus pegawai berdasarkan ID ===
exports.deletePegawai = async (req, res) => {
  try {
    const { id } = req.params;
    const pegawai = await Pegawai.findByPk(id);

    if (!pegawai) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan" });
    }

    await pegawai.destroy();

    res.status(200).json({ message: "Pegawai berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal menghapus data pegawai:", error);
    res.status(500).json({ message: "Gagal menghapus data pegawai", error });
  }
};
