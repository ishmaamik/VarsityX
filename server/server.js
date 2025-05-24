// server.js 
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import adminRoutes from './routes/adminRoutes.js';  // Separate Admin routes for admin-specific tasks
import userRoutes from './routes/userRoutes.js';
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
import upload from './middleware/upload.js';
import './config/passport.js';

import chataiRoutes from './routes/chatai.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware setup
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging setup
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Passport middleware
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    
    // Initialize Socket.io
    const io = initializeSocket(httpServer);
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // Add suspension check
    app.use(checkSuspension);

    // Routes
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/marketplace', marketplaceRoutes);
    app.use('/cart', cartRoutes);
    app.use('/orders', orderRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/upload', uploadRoutes);
    app.use('/images', gridfsRoutes);
    app.use('/api/price-advisor', priceAdvisorRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/universities', universityRoutes);
    app.use('/api/chatai', chataiRoutes);

    // Home route
    app.get('/', (req, res) => res.send('VarsityX API Running'));

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
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
