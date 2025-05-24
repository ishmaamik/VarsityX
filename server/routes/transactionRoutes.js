import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createTransaction,
  completeTransaction,
  addReview,
  getUserTransactions,
  cancelTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create a new transaction
router.post('/', createTransaction);

// Complete a transaction
router.patch('/:transactionId/complete', completeTransaction);

// Add a review to a transaction
router.post('/:transactionId/reviews', addReview);

// Get user's transactions
router.get('/user', getUserTransactions);

// Cancel a transaction
router.patch('/:transactionId/cancel', cancelTransaction);

export default router; 