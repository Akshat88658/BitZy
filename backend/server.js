require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const socketService = require('./services/socketService');
const startAuctionScheduler = require('./utils/auctionScheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to MongoDB database and seed
connectDB().then(() => {
  const seedAuctions = require('./utils/seeder');
  seedAuctions();
});

const app = express();

// Standard middlewares
app.use(cors({
  origin: '*', // Adjust for specific production frontend domains if deploying
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Bidzy - Student Auction Marketplace API is running...' });
});

// Mount routing layers
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Fallback error middlewares
app.use(notFound);
app.use(errorHandler);

// Instantiate HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
socketService.init(server);

// Start the background auction expiry scheduler
startAuctionScheduler();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
