import SSLCommerzPayment from 'sslcommerz-lts';
import Transaction from '../models/Transaction.js';
import Listing from '../models/Listing.js';
import dotenv from 'dotenv';

dotenv.config();

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; // Set to true for production

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

    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: transaction._id.toString(), // unique tran_id for each transaction
      success_url: `${process.env.SERVER_URL}/api/payment/success`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
      shipping_method: 'NO',
      product_name: items.map(item => item.listing.title).join(', '),
      product_category: 'General',
      product_profile: 'general',
      cus_name: req.user.displayName,
      cus_email: req.user.email,
      cus_add1: 'Customer Address',
      cus_city: 'Customer City',
      cus_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({
        success: true,
        url: apiResponse.GatewayPageURL,
        transactionId: transaction._id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'SSL payment initialization failed'
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing payment'
    });
  }
};

// Payment success
export const paymentSuccess = async (req, res) => {
  try {
    const { val_id, tran_id, amount, card_type, card_no, bank_tran_id, status, tran_date } = req.body;

    const transaction = await Transaction.findById(tran_id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update transaction status and payment details
    transaction.status = 'Completed';
    transaction.paymentDetails = {
      val_id,
      amount,
      card_type,
      card_no,
      bank_tran_id,
      status,
      tran_date
    };
    await transaction.save();

    // Update listing status to sold
    for (const item of transaction.items) {
      await Listing.findByIdAndUpdate(item.listing, {
        status: 'sold'
      });
    }

    // Redirect to frontend success page
    res.redirect(`${process.env.CLIENT_URL}/payment/success?transactionId=${tran_id}`);
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};

// Payment failure
export const paymentFailure = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const transaction = await Transaction.findById(tran_id);
    if (transaction) {
      transaction.status = 'Failed';
      transaction.paymentDetails = req.body;
      await transaction.save();
    }

    res.redirect(`${process.env.CLIENT_URL}/payment/failed?transactionId=${tran_id}`);
  } catch (error) {
    console.error('Payment failure error:', error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};

// Payment cancel
export const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const transaction = await Transaction.findById(tran_id);
    if (transaction) {
      transaction.status = 'Cancelled';
      await transaction.save();
    }

    res.redirect(`${process.env.CLIENT_URL}/payment/cancelled?transactionId=${tran_id}`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
  }
};

// IPN (Instant Payment Notification)
export const ipn = async (req, res) => {
  try {
    const { val_id, tran_id, status } = req.body;

    const transaction = await Transaction.findById(tran_id);
    if (transaction) {
      transaction.status = status === 'VALID' ? 'Completed' : 'Failed';
      transaction.paymentDetails = req.body;
      await transaction.save();

      if (status === 'VALID') {
        // Update listing status to sold
        for (const item of transaction.items) {
          await Listing.findByIdAndUpdate(item.listing, {
            status: 'sold'
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'IPN received'
    });
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing IPN'
    });
  }
}; 