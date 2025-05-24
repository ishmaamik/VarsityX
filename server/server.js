// server.js - Fixed version
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import upload from './middleware/upload.js';
import './config/passport.js';
import priceAdvisorRoutes from './routes/priceAdvisorRoutes.js';
import chataiRoutes from './routes/chatai.js';

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Routes
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/marketplace', marketplaceRoutes);
    app.use('/cart', cartRoutes);
    app.use('/orders', orderRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/api/price-advisor', priceAdvisorRoutes);
    app.use('/api/chatai', chataiRoutes);

    // Home route
    app.get('/', (req, res) => res.send('VarsityX API Running'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });