import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { listingId } = req.body;
    const buyerId = req.user.userId;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() === buyerId) {
      return res.status(400).json({ success: false, message: 'Cannot buy your own listing' });
    }

    const transaction = new Transaction({
      listing: listingId,
      buyer: buyerId,
      seller: listing.seller,
      amount: listing.price
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message
    });
  }
};

// Complete a transaction
export const completeTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.seller.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing transaction',
      error: error.message
    });
  }
};

// Add a review to a transaction
export const addReview = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot review incomplete transaction' });
    }

    const isBuyer = transaction.buyer.toString() === userId;
    const isSeller = transaction.seller.toString() === userId;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this transaction' });
    }

    // Add review to transaction
    if (isBuyer) {
      if (transaction.buyerReview) {
        return res.status(400).json({ success: false, message: 'Already reviewed' });
      }
      transaction.buyerReview = { rating, comment, createdAt: new Date() };
    } else {
      if (transaction.sellerReview) {
        return res.status(400).json({ success: false, message: 'Already reviewed' });
      }
      transaction.sellerReview = { rating, comment, createdAt: new Date() };
    }

    await transaction.save();

    // Update user rating
    const targetUser = isBuyer ? transaction.seller : transaction.buyer;
    const user = await User.findById(targetUser);
    
    user.ratings.push({
      rating,
      reviewer: userId,
      transaction: transactionId,
      createdAt: new Date()
    });
    
    user.updateAverageRating();
    await user.save();

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// Get user's transactions
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
      .populate('listing')
      .populate('buyer', 'displayName photo')
      .populate('seller', 'displayName photo')
      .sort('-createdAt');

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting transactions',
      error: error.message
    });
  }
};

// Cancel a transaction
export const cancelTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.buyer.toString() !== userId && transaction.seller.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Can only cancel pending transactions' });
    }

    transaction.status = 'cancelled';
    transaction.cancelledAt = new Date();
    transaction.cancelReason = reason;
    await transaction.save();

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling transaction',
      error: error.message
    });
  }
}; 