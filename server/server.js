// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';  // Handles User and Admin authentication
import adminRoutes from './routes/adminRoutes.js';  // Separate Admin routes for admin-specific tasks
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import gridfsRoutes from './routes/gridfsRoutes.js';
import priceAdvisorRoutes from './routes/priceAdvisorRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';  // Import payment routes
import './config/passport.js';  // Passport configuration for Google OAuth
import { createServer } from 'http';
import initializeSocket from './config/socket.js';
import transactionRoutes from './routes/transactionRoutes.js';
import checkSuspension from './middleware/checkSuspension.js';
import morgan from 'morgan';
import errorHandler from './middleware/error.js';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.js';
import universityRoutes from './routes/universityRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import studentAdminRoutes from './routes/studentAdminRoutes.js';
import listingRoutes from './routes/listingRoutes.js';  // Import listing routes

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Create a write stream for logging
  const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Passport middleware
app.use(passport.initialize());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    
    // Initialize Socket.io after MongoDB connection
    const io = initializeSocket(httpServer);
    
    // Attach io to request object
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // Add suspension check before routes
    app.use(checkSuspension);

    // Routes
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/marketplace', marketplaceRoutes);
    app.use('/api/cart', cartRoutes);  // Only this route needs /api prefix
    app.use('/orders', orderRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/upload', uploadRoutes);
    app.use('/images', gridfsRoutes);
    app.use('/api/price-advisor', priceAdvisorRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/payment', paymentRoutes);  // Register payment routes
    app.use('/api/auth', authRoutes);
    app.use('/api/universities', universityRoutes);
    app.use('/api/bids', bidRoutes);  // Register bid routes
    app.use('/api/student-admin', studentAdminRoutes);  // Register student admin routes
    app.use('/api/admin', adminRoutes);  // Make sure this line exists and is using the correct path
    app.use('/api/listings', listingRoutes);  // Mount listing routes

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    });

    // Start server
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
