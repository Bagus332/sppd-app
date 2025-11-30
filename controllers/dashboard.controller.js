// backend/controllers/dashboard.controller.js
const PerjalananDinas = require('../models/PerjalananDinas.model');
const Pegawai = require('../models/Pegawai.model');

/**
 * Get Dashboard Statistics
 * Returns real-time counts for dashboard display
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total perjalanan dinas
    const totalPerjalanan = await PerjalananDinas.count();
    
    // Count total SPD (same as perjalanan dinas since each has SPD)
    const totalSPD = totalPerjalanan;
    
    // Count total pegawai
    const totalPegawai = await Pegawai.count();
    
    // Count completed surat (you can add a status field later)
    // For now, we'll count all as completed
    const suratSelesai = totalPerjalanan;
    
    // Get recent activity (last 5 surat)
    const recentSurat = await PerjalananDinas.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'nomor', 'spd_nomor', 'maksud_dinas', 'createdAt']
    });

    return res.status(200).json({
      success: true,
      data: {
        totalPerjalanan,
        totalSPD,
        totalPegawai,
        suratSelesai,
        recentActivity: recentSurat
      }
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil statistik dashboard', 
      error: error.message 
    });
  }
};
