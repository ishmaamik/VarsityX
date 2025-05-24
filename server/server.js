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
import createUploadRouter from './routes/uploadRoutes.js';
import { createUpload } from './config/upload.js';
import './config/passport.js';

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

let gfs;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Initialize GridFS after connection is established
    const conn = mongoose.connection;
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS initialized');

    // Store gfs in app.locals for access in controllers
    app.locals.gfs = gfs;

    // Create upload middleware after connection is ready
    const upload = createUpload(process.env.MONGO_URI);
    
    // Routes
    app.use('/user', userRoutes);
    app.use('/admin', adminRoutes);
    app.use('/marketplace', marketplaceRoutes);
    app.use('/cart', cartRoutes);
    app.use('/orders', orderRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/upload', createUploadRouter(upload));

    // File serving route
    app.get('/file/:filename', (req, res) => {
      gfs.find({ filename: req.params.filename }).toArray((err, files) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        if (!files || files.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'File not found'
          });
        }
        
        // Set content type
        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        
        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        readStream.on('error', (error) => {
          res.status(500).json({
            success: false,
            message: 'Error streaming file',
            error: error.message
          });
        });
        
        readStream.pipe(res);
      });
    });

    // Home route
    app.get('/', (req, res) => res.send('DestiNova API Running'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });