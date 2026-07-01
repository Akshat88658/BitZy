const express = require('express');
const router = express.Router();
const { placeBid, getBidHistory } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, placeBid);

router.get('/auction/:auctionId', getBidHistory);

module.exports = router;
