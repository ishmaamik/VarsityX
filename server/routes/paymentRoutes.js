import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  initPayment,
  paymentSuccess,
  paymentFailure,
  paymentCancel,
} from '../controllers/paymentController.js';

dotenv.config();
const router = express.Router();

// Add body-parser middleware for URL-encoded bodies (important for SSLCommerz POST data)
router.use(express.urlencoded({ extended: true }));

// Protected route - requires authentication
router.post('/init', authenticate, initPayment);

// SSLCommerz callback routes - no authentication needed
router.post('/success', paymentSuccess);
router.post('/fail', paymentFailure);
router.post('/cancel', paymentCancel);

// Initialize SSLCommerz payment
router.post('/ssl', authenticate, async (req, res) => {
  try {
    console.log('Initializing SSLCommerz payment...');
    const userId = req.user.userId;
    const { amount } = req.body;
    const transactionId = uuidv4();

    console.log('Payment request details:', {
      userId,
      amount,
      transactionId
    });

    // SSLCommerz payment data
    const paymentData = {
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_PASS,
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: 'http://localhost:5173/marketplace/payment-status?status=success',
      fail_url: 'http://localhost:5173/marketplace/payment-status?status=failed',
      cancel_url: 'http://localhost:5173/marketplace/payment-status?status=cancelled',
      ipn_url: 'http://localhost:5000/api/payment/ipn',
      shipping_method: 'NO',
      product_name: 'Marketplace Items',
      product_category: 'Digital',
      product_profile: 'general',
      cus_name: req.user.displayName,
      cus_email: req.user.email,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000',
      cus_fax: '01700000000',
      multi_card_name: 'mastercard,visacard,bkash,nagad,rocket',
      value_a: userId,
      value_b: amount,
      value_c: 'ref003',
      value_d: 'ref004'
    };

    console.log('SSLCommerz API URL:', process.env.SSLC_API_URL);

    // Save transaction in database
    await Transaction.create({
      user: userId,
      transactionId,
      amount,
      status: "Initiated",
    });

    console.log('Transaction saved to database');

    // Initialize SSLCommerz payment
    const response = await axios.post(process.env.SSLC_API_URL, paymentData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('SSLCommerz response:', response.data);

    if (response.data?.status === 'SUCCESS') {
      res.json({ GatewayPageURL: response.data.GatewayPageURL });
    } else {
      throw new Error('Failed to initialize payment');
    }
  } catch (error) {
    console.error("❌ SSLCommerz Init Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// Success URL Handler - No authentication required as it's a redirect from SSLCommerz
router.post('/success', async (req, res) => {
  try {
    console.log('Payment success callback received:', req.body);
    const { tran_id, val_id, amount, card_type, card_no, bank_tran_id, status, tran_date } = req.body;

    // Validate transaction
    const transaction = await Transaction.findOne({ transactionId: tran_id });
    if (!transaction) {
      console.error('Transaction not found:', tran_id);
      return res.redirect('http://localhost:5173/marketplace/payment-status?status=failed&message=Transaction+not+found');
    }

    // Update transaction status
    transaction.status = "Completed";
    transaction.paymentDetails = {
      validationId: val_id,
      amount,
      cardType: card_type,
      cardNumber: card_no,
      bankTransactionId: bank_tran_id,
      status,
      transactionDate: tran_date
    };
    await transaction.save();
    console.log('Transaction updated:', transaction);

    // Redirect to success page
    res.redirect(`http://localhost:5173/marketplace/payment-status?status=success&transactionId=${tran_id}`);
  } catch (error) {
    console.error("❌ Payment Success Error:", error);
    res.redirect('http://localhost:5173/marketplace/payment-status?status=error');
  }
});

// Failure URL Handler - No authentication required as it's a redirect from SSLCommerz
router.post('/fail', async (req, res) => {
  try {
    console.log('Payment failure callback received:', req.body);
    const { tran_id } = req.body;

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      { status: "Failed" }
    );
    console.log('Transaction marked as failed:', tran_id);

    // Redirect to failure page
    res.redirect(`http://localhost:5173/marketplace/payment-status?status=failed&transactionId=${tran_id}`);
  } catch (error) {
    console.error("❌ Payment Failure Error:", error);
    res.redirect('http://localhost:5173/marketplace/payment-status?status=error');
  }
});

// IPN Handler - No authentication required as it's from SSLCommerz
router.post('/ipn', async (req, res) => {
  try {
    console.log('IPN callback received:', req.body);
    const { tran_id, status } = req.body;

    // Update transaction status based on IPN
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      { status: status === 'VALID' ? 'Completed' : 'Failed' }
    );
    console.log('Transaction status updated via IPN:', { tran_id, status });

    res.json({ status: 'IPN received' });
  } catch (error) {
    console.error("❌ IPN Error:", error);
    res.status(500).json({ error: "IPN processing failed" });
  }
});

export default router; 