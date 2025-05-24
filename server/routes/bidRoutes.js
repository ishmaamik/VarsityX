import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import {
  placeBid,
  getListingBids,
  getUserBids
} from '../controllers/bidController.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Place a bid
router.post('/listings/:id/bid', authorizeRole(['User']), placeBid);

// Get all bids for a listing
router.get('/listings/:id', getListingBids);

// Get user's bids
router.get('/user', getUserBids);

export default router; 