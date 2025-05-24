import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Store user's socket id
    onlineUsers.set(socket.userId, socket.id);
    
    // Join user's personal room
    socket.join(socket.userId);

    // Notify others that user is online
    socket.broadcast.emit('user_online', socket.userId);

    // Send current online users to the connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit('online_users', onlineUsersList);

    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId) => {
      console.log(`User ${socket.userId} joining conversation: ${conversationId}`);
      socket.join(conversationId);
    });

    // Handle leaving conversation rooms
    socket.on('leave_conversation', (conversationId) => {
      console.log(`User ${socket.userId} leaving conversation: ${conversationId}`);
      socket.leave(conversationId);
    });

    // Handle typing status
    socket.on('typing', ({ conversationId, recipientId }) => {
      io.to(conversationId).emit('typing', {
        conversationId,
        senderId: socket.userId
      });
    });

    // Handle stop typing
    socket.on('stop_typing', ({ conversationId }) => {
      io.to(conversationId).emit('stop_typing', {
        conversationId,
        senderId: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit('user_offline', socket.userId);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

export default initializeSocket; 