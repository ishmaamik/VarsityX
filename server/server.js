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
import './config/passport.js';  // Passport configuration for Google OAuth
import { createServer } from 'http';
import initializeSocket from './config/socket.js';
import transactionRoutes from './routes/transactionRoutes.js';
import  checkSuspension  from './middleware/checkSuspension.js';
import morgan from 'morgan';
import errorHandler from './middleware/error.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files from uploads directory
app.use('/upload/file', express.static('uploads'));

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

    // Add suspension check after authentication
    app.use(checkSuspension);

    // Error handler
    app.use(errorHandler);

    // Start server
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
