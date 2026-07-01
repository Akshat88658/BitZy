const socketIO = require('socket.io');

let io;

const socketService = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: '*', // In production, replace with specific frontend domains
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log(`Socket client connected: ${socket.id}`);

      // User registers their personal room using their database User ID
      socket.on('register', (userId) => {
        if (userId) {
          socket.join(userId);
          console.log(`User ${userId} registered socket channel: ${socket.id}`);
        }
      });

      // User joins a specific auction bidding room
      socket.on('join_auction', (auctionId) => {
        if (auctionId) {
          socket.join(auctionId);
          console.log(`Socket client ${socket.id} joined auction room: ${auctionId}`);
        }
      });

      // User leaves an auction bidding room
      socket.on('leave_auction', (auctionId) => {
        if (auctionId) {
          socket.leave(auctionId);
          console.log(`Socket client ${socket.id} left auction room: ${auctionId}`);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Socket client disconnected: ${socket.id}`);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },

  // Broadcast a new bid to all clients in that auction's room
  emitBidUpdate: (auctionId, auctionData) => {
    if (io) {
      io.to(auctionId).emit('bid_updated', auctionData);
    }
  },

  // Send a real-time notification to a specific user
  emitNotification: (userId, notificationData) => {
    if (io) {
      io.to(userId).emit('notification_received', notificationData);
    }
  },

  // Broadcast that an auction has closed
  emitAuctionClosed: (auctionId, resultData) => {
    if (io) {
      io.to(auctionId).emit('auction_closed', resultData);
    }
  }
};

module.exports = socketService;
