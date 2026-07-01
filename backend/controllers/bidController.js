const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const Notification = require('../models/Notification');
const socketService = require('../services/socketService');

// @desc    Place a bid on an auction
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res, next) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      res.status(404);
      return next(new Error('Auction listing not found'));
    }

    if (auction.status !== 'active') {
      res.status(400);
      return next(new Error('This auction has already ended or been cancelled'));
    }

    if (new Date() > new Date(auction.endDate)) {
      auction.status = 'ended';
      await auction.save();
      res.status(400);
      return next(new Error('This auction has expired'));
    }

    if (auction.seller.toString() === req.user._id.toString()) {
      res.status(400);
      return next(new Error('You cannot bid on your own auction'));
    }

    // Determine the minimum required bid
    const minBid = auction.highestBidder ? auction.currentBid + 1 : auction.startingBid;
    if (amount < minBid) {
      res.status(400);
      return next(new Error(`Bid amount must be at least ₹${minBid}`));
    }

    const previousBidder = auction.highestBidder;

    // Update auction state
    auction.currentBid = amount;
    auction.highestBidder = req.user._id;
    await auction.save();

    // Create the bid activity log
    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount
    });

    // Populate auction with user details for socket emission
    const populatedAuction = await Auction.findById(auctionId)
      .populate('highestBidder', 'username')
      .populate('seller', 'username');

    // Broadcast the updated auction to the auction room clients
    socketService.emitBidUpdate(auctionId.toString(), populatedAuction);

    // Send Real-time and Database Notifications
    // 1. Notify the previous highest bidder that they were outbid
    if (previousBidder && previousBidder.toString() !== req.user._id.toString()) {
      const outbidNotification = await Notification.create({
        user: previousBidder,
        type: 'bid_outbid',
        auction: auctionId,
        message: `You have been outbid on "${auction.title}". The new highest bid is ₹${amount}.`
      });
      socketService.emitNotification(previousBidder.toString(), outbidNotification);
    }

    // 2. Notify the seller of the new bid
    if (auction.seller.toString() !== req.user._id.toString()) {
      const sellerNotification = await Notification.create({
        user: auction.seller,
        type: 'new_bid',
        auction: auctionId,
        message: `A new bid of ₹${amount} was placed on your listing "${auction.title}".`
      });
      socketService.emitNotification(auction.seller.toString(), sellerNotification);
    }

    res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bid history for a specific auction
// @route   GET /api/bids/auction/:auctionId
// @access  Public
const getBidHistory = async (req, res, next) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .sort({ createdAt: -1 })
      .populate('bidder', 'username');

    res.json(bids);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeBid,
  getBidHistory
};
