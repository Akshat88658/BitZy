const express = require('express');
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getAuctionById,
  getMyListings,
  getMyBids,
  getMyWins,
  getMyLosses,
  cancelAuction,
  adminDeleteAuction
} = require('../controllers/auctionController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Auction listings
router.route('/')
  .post(protect, upload.array('images', 5), createAuction)
  .get(getAuctions);

// User-specific auction groupings (Dashboard support)
router.get('/my/listings', protect, getMyListings);
router.get('/my/bids', protect, getMyBids);
router.get('/my/wins', protect, getMyWins);
router.get('/my/losses', protect, getMyLosses);

// Single auction actions
router.route('/:id')
  .get(getAuctionById)
  .delete(protect, admin, adminDeleteAuction);

router.put('/:id/cancel', protect, cancelAuction);

module.exports = router;
