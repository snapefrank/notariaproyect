const express = require('express');
const router = express.Router();
const { getAssetSummary, getAssetSummaryByOwner } = require('../controllers/assetSummary.controller');

// Resumen general de activos
router.get('/summary', getAssetSummary);

// 🔍 Nuevo: Resumen por propietario
router.get('/summary-by-owner', getAssetSummaryByOwner);

module.exports = router;
