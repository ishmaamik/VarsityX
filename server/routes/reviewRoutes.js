import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  markHelpful,
  addReply,
  getUserReviews
} from '../controllers/reviewController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new review
// router.post('/', protect, upload.array('images', 5), createReview);

// // Get reviews for a product or seller
// router.get('/:type/:targetId', getReviews);

// // Update a review
// router.put('/:id', protect, upload.array('images', 5), updateReview);

// // Delete a review
// router.delete('/:id', protect, deleteReview);

// // Mark a review as helpful
// router.post('/:id/helpful', protect, markHelpful);

// // Add a reply to a review
// router.post('/:id/reply', protect, addReply);

// // Get reviews by the logged-in user
// router.get('/user', protect, getUserReviews);

export default router;