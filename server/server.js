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
import priceAdvisorRoutes from './routes/priceAdvisorRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import './config/passport.js';  // Passport configuration for Google OAuth
import { createServer } from 'http';
import initializeSocket from './config/socket.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());  

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/user', userRoutes); 

app.use('/admin', adminRoutes); 
app.use('/marketplace', marketplaceRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/upload', uploadRoutes);
app.use('/api/price-advisor', priceAdvisorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payment', paymentRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Home route
app.get('/', (req, res) => res.send('DestiNova API Running'));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
