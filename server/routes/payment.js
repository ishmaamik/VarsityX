import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

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
      success_url: `http://localhost:5000/api/payment/success?tran_id=${transactionId}`,
      fail_url: `http://localhost:5000/api/payment/fail?tran_id=${transactionId}`,
      cancel_url: `http://localhost:3000/cart`,
      ipn_url: `http://localhost:5000/api/payment/ipn`,
      shipping_method: 'NO',
      product_name: 'Marketplace Items',
      product_category: 'Digital',
      product_profile: 'general',
      cus_name: 'Student',
      cus_email: 'student@example.com',
      cus_add1: 'University Campus',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
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

// Success URL Handler
router.post('/success', async (req, res) => {
  try {
    const { tran_id } = req.body;
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      { status: "Success" }
    );
    res.redirect('http://localhost:3000/payment/success');
  } catch (error) {
    console.error('Success handler error:', error);
    res.redirect('http://localhost:3000/payment/fail');
  }
});

// Failure URL Handler
router.post('/fail', async (req, res) => {
  try {
    const { tran_id } = req.body;
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      { status: "Failed" }
    );
    res.redirect('http://localhost:3000/payment/fail');
  } catch (error) {
    console.error('Failure handler error:', error);
    res.redirect('http://localhost:3000/payment/fail');
  }
});

// IPN (Instant Payment Notification) Handler
router.post('/ipn', async (req, res) => {
  try {
    const { tran_id, status } = req.body;
    if (status === 'VALID' || status === 'VALIDATED') {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        { status: "Success" }
      );
    } else {
      await Transaction.findOneAndUpdate(
        { transactionId: tran_id },
        { status: "Failed" }
      );
    }
    res.status(200).json({ status: 'Success' });
  } catch (error) {
    console.error('IPN handler error:', error);
    res.status(500).json({ error: 'IPN handling failed' });
  }
});

export default router;
