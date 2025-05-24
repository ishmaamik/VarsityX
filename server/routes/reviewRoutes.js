import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createReview,
  getListingReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Get reviews for a listing
router.get('/listing/:listingId', getListingReviews);

// Protected routes
router.use(authenticate);

// Create a review for a listing
router.post('/listing/:listingId', createReview);

// Update a review
router.put('/:reviewId', updateReview);

// Delete a review
router.delete('/:reviewId', deleteReview);

export default router;