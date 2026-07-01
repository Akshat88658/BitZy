const express = require('express');
const router = express.Router();
const {
  generateDescription,
  estimatePricing,
  checkFraudRisk
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-description', protect, generateDescription);
router.post('/estimate-price', protect, estimatePricing);
router.post('/check-fraud', protect, checkFraudRisk);

module.exports = router;
