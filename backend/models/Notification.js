const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['auction_won', 'auction_lost', 'auction_ended', 'bid_outbid', 'new_bid', 'info'],
      default: 'info'
    },
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction'
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
