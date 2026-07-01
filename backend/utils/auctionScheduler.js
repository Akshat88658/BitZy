const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');
const socketService = require('../services/socketService');

const startAuctionScheduler = () => {
  console.log('Auction automated expiry scheduler started (checking every 60s)...');

  setInterval(async () => {
    try {
      const now = new Date();
      // Find active auctions that have passed their end date
      const expiredAuctions = await Auction.find({
        status: 'active',
        endDate: { $lte: now }
      }).populate('seller', 'username');

      if (expiredAuctions.length === 0) return;

      console.log(`Found ${expiredAuctions.length} expired auctions. Processing closure...`);

      for (const auction of expiredAuctions) {
        auction.status = 'ended';
        await auction.save();

        const title = auction.title;
        const highestBid = auction.currentBid;
        const winnerId = auction.highestBidder;
        const sellerId = auction.seller._id;

        if (winnerId) {
          // Fetch winner username
          const BidderModel = require('../models/User');
          const winner = await BidderModel.findById(winnerId);
          const winnerName = winner ? winner.username : 'Student';

          // 1. Notify the Winner
          const winNotification = await Notification.create({
            user: winnerId,
            type: 'auction_won',
            auction: auction._id,
            message: `Congratulations! You won the auction for "${title}" with a final bid of ${highestBid}.`
          });
          socketService.emitNotification(winnerId.toString(), winNotification);

          // 2. Notify the Seller
          const sellNotification = await Notification.create({
            user: sellerId,
            type: 'auction_ended',
            auction: auction._id,
            message: `Your auction for "${title}" has ended. Winner: ${winnerName} with bid of ${highestBid}.`
          });
          socketService.emitNotification(sellerId.toString(), sellNotification);

          // 3. Notify other losing bidders
          const uniqueBidders = await Bid.find({ 
            auction: auction._id, 
            bidder: { $ne: winnerId } 
          }).distinct('bidder');

          for (const bidderId of uniqueBidders) {
            const lossNotification = await Notification.create({
              user: bidderId,
              type: 'auction_lost',
              auction: auction._id,
              message: `The auction for "${title}" has closed. The winning bid was ${highestBid}.`
            });
            socketService.emitNotification(bidderId.toString(), lossNotification);
          }

          // Emit real-time auction closed event to the auction room
          socketService.emitAuctionClosed(auction._id.toString(), {
            status: 'ended',
            winner: winnerName,
            highestBid
          });

          console.log(`Auction "${title}" closed. Winner: ${winnerName}, Bid: ${highestBid}`);
        } else {
          // Ended with no bids
          const noBidNotification = await Notification.create({
            user: sellerId,
            type: 'auction_ended',
            auction: auction._id,
            message: `Your auction for "${title}" has ended. Unfortunately, no bids were placed.`
          });
          socketService.emitNotification(sellerId.toString(), noBidNotification);

          socketService.emitAuctionClosed(auction._id.toString(), {
            status: 'ended',
            winner: null,
            highestBid: null
          });

          console.log(`Auction "${title}" closed with no bids.`);
        }
      }
    } catch (error) {
      console.error('Error running auction scheduler:', error.message);
    }
  }, 60000); // Check every minute
};

module.exports = startAuctionScheduler;
