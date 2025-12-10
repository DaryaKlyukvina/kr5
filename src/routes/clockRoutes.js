const express = require('express');
const router = express.Router();
const clockController = require('../controllers/clockController');

router.get('/time', clockController.getCurrentTime);
router.get('/timezone', clockController.getTimezoneTime);
router.get('/analog', clockController.getAnalogTime);

module.exports = router;