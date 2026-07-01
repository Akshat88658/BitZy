const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    startingBid: {
      type: Number,
      required: true,
      min: 0
    },
    currentBid: {
      type: Number,
      required: true,
      min: 0
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    images: {
      type: [String],
      default: []
    },
    duration: {
      type: Number, // in hours
      required: true
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'cancelled'],
      default: 'active'
    },
    collegeName: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    aiPriceEstimation: {
      marketValue: { type: Number },
      recommendedStartingBid: { type: Number },
      suggestedDurationHours: { type: Number },
      reasoning: { type: String }
    },
    aiFraudRisk: {
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
      reasons: { type: [String], default: [] }
    }
  },
  {
    timestamps: true
  }
);

// Calculate default values before validation
auctionSchema.pre('validate', function (next) {
  if (this.duration && !this.endDate) {
    this.endDate = new Date(Date.now() + this.duration * 60 * 60 * 1000);
  }
  if (this.startingBid && this.currentBid === undefined) {
    this.currentBid = this.startingBid;
  }
  next();
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
