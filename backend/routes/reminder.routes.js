const express = require('express');
const router = express.Router();
const { getExpiringReminders } = require('../controllers/reminder.controller');

router.get('/', getExpiringReminders);

module.exports = router;
