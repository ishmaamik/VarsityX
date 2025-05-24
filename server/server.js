// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';  // Handles User and Admin authentication
import adminRoutes from './routes/adminRoutes.js';  // Separate Admin routes for admin-specific tasks
import './config/passport.js';  // Passport configuration for Google OAuth

dotenv.config();

const app = express();

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
app.use('/user', userRoutes); 

app.use('/admin', adminRoutes); 


// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Home route
app.get('/', (req, res) => res.send('DestiNova API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
