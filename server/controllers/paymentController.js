import Transaction from '../models/Transaction.js';
import Listing from '../models/Listing.js';

// Initialize payment
export const initPayment = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    if (!items || !items.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment data'
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.userId,
      items,
      totalAmount,
      status: 'Initiated'
    });
    await transaction.save();

    // For testing, simulate a successful payment initialization
    const mockPaymentURL = `http://localhost:5173/marketplace/payment-status?transactionId=${transaction._id}&status=success`;

    res.json({
      success: true,
      url: mockPaymentURL,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing payment',
      error: error.message
    });
  }
};

// Payment success
export const paymentSuccess = async (req, res) => {
  try {
    const { transactionId } = req.query;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction status
    transaction.status = 'Completed';
    await transaction.save();

    // Update listing status to sold
    for (const item of transaction.items) {
      await Listing.findByIdAndUpdate(item.listing, {
        status: 'sold'
      });
    }

    res.json({
      success: true,
      message: 'Payment completed successfully',
      transaction
    });
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment success',
      error: error.message
    });
  }
};

// Payment failure
export const paymentFailure = async (req, res) => {
  try {
    const { transactionId } = req.query;

    const transaction = await Transaction.findById(transactionId);
    if (transaction) {
      transaction.status = 'Failed';
      await transaction.save();
    }

    res.json({
      success: false,
      message: 'Payment failed',
      transaction
    });
  } catch (error) {
    console.error('Payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment failure',
      error: error.message
    });
  }
};

// Payment cancel
export const paymentCancel = async (req, res) => {
  try {
    const { transactionId } = req.query;

    const transaction = await Transaction.findById(transactionId);
    if (transaction) {
      transaction.status = 'Cancelled';
      await transaction.save();
    }

    res.json({
      success: false,
      message: 'Payment cancelled',
      transaction
    });
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment cancellation',
      error: error.message
    });
  }
}; 