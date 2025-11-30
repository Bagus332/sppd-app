const express = require("express");
const router = express.Router();
const { sequelize } = require("../db.config");

// GET total perjalanan dinas
router.get("/count", async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM perjalanan_dinas"
    );

    res.json({ total: results[0].total });
  } catch (error) {
    console.error("Error mengambil total perjalanan:", error);
    res.status(500).json({ error: "Gagal mengambil total perjalanan" });
  }
});

module.exports = router;
