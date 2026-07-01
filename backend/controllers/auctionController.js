const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Create a new auction listing
// @route   POST /api/auctions
// @access  Private
const createAuction = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      startingBid,
      duration,
      location
    } = req.body;

    // Fallback: use seller's own collegeName if not sent from frontend
    const collegeName = req.body.collegeName || req.user.collegeName;

    const images = req.files ? req.files.map(file => file.path || file.secure_url) : [];

    let aiPriceEstimation = {};
    let aiFraudRisk = {};

    if (req.body.aiPriceEstimation) {
      try {
        aiPriceEstimation = typeof req.body.aiPriceEstimation === 'string'
          ? JSON.parse(req.body.aiPriceEstimation)
          : req.body.aiPriceEstimation;
      } catch (error) {
        console.error('Failed to parse aiPriceEstimation:', error.message);
      }
    }

    if (req.body.aiFraudRisk) {
      try {
        aiFraudRisk = typeof req.body.aiFraudRisk === 'string'
          ? JSON.parse(req.body.aiFraudRisk)
          : req.body.aiFraudRisk;
      } catch (error) {
        console.error('Failed to parse aiFraudRisk:', error.message);
      }
    }

    const auction = await Auction.create({
      seller: req.user._id,
      title,
      description,
      category,
      condition,
      startingBid: parseFloat(startingBid),
      currentBid: parseFloat(startingBid),
      duration: parseInt(duration),
      collegeName,
      location,
      images,
      aiPriceEstimation,
      aiFraudRisk
    });

    res.status(201).json(auction);
  } catch (error) {
    next(error);
  }
};


// @desc    Get all auctions (with optional filtering)
// @route   GET /api/auctions
// @access  Public
const getAuctions = async (req, res, next) => {
  try {
    const query = { status: req.query.status || 'active' };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.condition && req.query.condition !== 'All') {
      query.condition = req.query.condition;
    }

    if (req.query.collegeName && req.query.collegeName !== 'All') {
      query.collegeName = req.query.collegeName;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const auctions = await Auction.find(query)
      .sort({ createdAt: -1 })
      .populate('seller', 'username');

    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single auction details
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'username email')
      .populate('highestBidder', 'username');

    if (auction) {
      res.json(auction);
    } else {
      res.status(404);
      return next(new Error('Auction listing not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's listings
// @route   GET /api/auctions/my/listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate('seller', 'username');

    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get auctions where logged in user placed bids
// @route   GET /api/auctions/my/bids
// @access  Private
const getMyBids = async (req, res, next) => {
  try {
    const bidAuctionIds = await Bid.find({ bidder: req.user._id }).distinct('auction');

    const auctions = await Auction.find({ _id: { $in: bidAuctionIds } })
      .sort({ updatedAt: -1 })
      .populate('seller', 'username');

    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get auctions won by logged in user
// @route   GET /api/auctions/my/wins
// @access  Private
const getMyWins = async (req, res, next) => {
  try {
    const auctions = await Auction.find({
      highestBidder: req.user._id,
      status: 'ended'
    })
      .sort({ endDate: -1 })
      .populate('seller', 'username');

    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get auctions where user placed bids but lost
// @route   GET /api/auctions/my/losses
// @access  Private
const getMyLosses = async (req, res, next) => {
  try {
    const bidAuctionIds = await Bid.find({ bidder: req.user._id }).distinct('auction');

    const auctions = await Auction.find({
      _id: { $in: bidAuctionIds },
      status: 'ended',
      highestBidder: { $ne: req.user._id }
    })
      .sort({ endDate: -1 })
      .populate('seller', 'username');

    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an auction listing
// @route   PUT /api/auctions/:id/cancel
// @access  Private
const cancelAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      res.status(404);
      return next(new Error('Auction listing not found'));
    }

    if (auction.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('You are not authorized to cancel this auction'));
    }

    if (auction.status !== 'active') {
      res.status(400);
      return next(new Error('Only active auctions can be cancelled'));
    }

    auction.status = 'cancelled';
    await auction.save();

    res.json({ message: 'Auction cancelled successfully', auction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an auction (Admin only)
// @route   DELETE /api/auctions/:id
// @access  Private/Admin
const adminDeleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      res.status(404);
      return next(new Error('Auction listing not found'));
    }

    await Auction.deleteOne({ _id: req.params.id });

    // Delete associated bids as well
    await Bid.deleteMany({ auction: req.params.id });

    res.json({ message: 'Auction listing deleted successfully by admin' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  getMyListings,
  getMyBids,
  getMyWins,
  getMyLosses,
  cancelAuction,
  adminDeleteAuction
};
