import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

// Add body-parser middleware for URL-encoded bodies (important for SSLCommerz POST data)
router.use(express.urlencoded({ extended: true }));

router.post('/ssl', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;

    const { amount } = req.body;
    const transactionId = uuidv4();

    // SSLCommerz payment data
    const paymentData = {
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_PASS,
      total_amount: amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: 'http://localhost:5000/api/payment/success',  // Removed query parameter
      fail_url: 'http://localhost:5000/api/payment/fail',        // Removed query parameter
      cancel_url: 'http://localhost:5173/marketplace/buy?status=cancelled&message=Payment+cancelled',
      ipn_url: 'http://localhost:5000/api/payment/ipn',
      shipping_method: 'NO',
      product_name: 'Marketplace Items',
      product_category: 'Digital',
      product_profile: 'general',
      cus_name: 'Student',
      cus_email: 'student@example.com',
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

    // Save transaction in database
    await Transaction.create({
      user: userId,
      transactionId,
      amount,
      status: "Initiated",
    });

    // Initialize SSLCommerz payment
    const response = await axios.post(process.env.SSLC_API_URL, paymentData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

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

// Success URL Handler - handle both GET and POST
const handleSuccess = async (req, res) => {
  try {
    console.log('Success Handler - Full Request:', {
      method: req.method,
      query: req.query,
      body: req.body,
      params: req.params
    });

    // SSLCommerz sends data in POST body with val_id and tran_id
    const tran_id = req.body?.tran_id || req.query?.tran_id;
    const val_id = req.body?.val_id || req.query?.val_id;

    console.log('Transaction Details:', { tran_id, val_id });

    if (!tran_id) {
      console.error('No transaction ID provided');
      return res.redirect('http://localhost:5173/marketplace/buy?status=error&message=Invalid+transaction');
    }

    // Update transaction status
    const transaction = await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      {
        status: "Success",
        updatedAt: new Date(),
        paymentDetails: {
          ...req.body,
          validationId: val_id
        }
      },
      { new: true }
    );

    console.log('Updated Transaction:', transaction);

    // Redirect to marketplace with success message
    res.redirect('http://localhost:5173/marketplace/buy?status=success&message=Payment+successful');
  } catch (error) {
    console.error('Success handler error:', error);
    res.redirect('http://localhost:5173/marketplace/buy?status=error&message=Payment+verification+failed');
  }
};

// Failure URL Handler - handle both GET and POST
const handleFailure = async (req, res) => {
  try {
    // Get transaction ID from either query params (GET) or body (POST)
    const tran_id = req.method === 'POST' ? req.body.tran_id : req.query.tran_id;

    // Log the request details for debugging
    console.log('Failure Handler Request:', {
      method: req.method,
      query: req.query,
      body: req.body,
      tran_id: tran_id
    });

    if (!tran_id) {
      console.error('No transaction ID provided');
      return res.redirect('http://localhost:5173/marketplace/buy?status=error&message=Invalid+transaction');
    }

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      {
        status: "Failed",
        updatedAt: new Date(),
        error: req.method === 'POST' ? (req.body.error || 'Payment failed') : 'Payment failed'
      }
    );

    // Redirect to marketplace with failure message
    res.redirect('http://localhost:5173/marketplace/buy?status=failed&message=Payment+failed');
  } catch (error) {
    console.error('Failure handler error:', error);
    res.redirect('http://localhost:5173/marketplace/buy?status=error&message=Something+went+wrong');
  }
};

// Register routes for both GET and POST
router.get('/success', handleSuccess);
router.post('/success', handleSuccess);
router.get('/fail', handleFailure);
router.post('/fail', handleFailure);

// IPN Handler
router.post('/ipn', async (req, res) => {
  try {
    const { tran_id, status, val_id, amount, card_type, card_no, bank_tran_id, tran_date } = req.body;

    if (!tran_id) {
      return res.status(400).json({ error: 'No transaction ID provided' });
    }

    if (status === 'VALID' || status === 'VALIDATED') {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        {
          status: "Success",
          updatedAt: new Date(),
          paymentDetails: {
            validationId: val_id,
            amount,
            cardType: card_type,
            cardNumber: card_no,
            bankTransactionId: bank_tran_id,
            transactionDate: tran_date
          }
        }
      );
    } else {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        {
          status: "Failed",
          updatedAt: new Date(),
          error: req.body.error || 'Payment validation failed'
        }
      );
    }

    res.status(200).json({ status: 'Success' });
  } catch (error) {
    console.error('IPN handler error:', error);
    res.status(500).json({ error: 'IPN handling failed' });
  }
});

export default router;
