// backend/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/dashboard/stats - Get dashboard statistics (Protected)
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
