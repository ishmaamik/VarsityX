import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

router.post('/ssl', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded?.id;

  const { amount } = req.body;
  const transactionId = uuidv4();

  const paymentData = {
    store_id: process.env.SSLC_STORE_ID,
    store_passwd: process.env.SSLC_PASS,
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `http://localhost:5000/api/payment/success?tran_id=${transactionId}`,
    fail_url: `http://localhost:5000/api/payment/fail?tran_id=${transactionId}`,
    cancel_url: `http://localhost:3000/cart`,
    cus_name: "Student",
    cus_email: "student@example.com",
    cus_add1: "University Campus",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    shipping_method: "NO",
    product_name: "Marketplace Items",
    product_category: "Digital",
    product_profile: "general",
  };

  await Transaction.create({
    user: userId,
    transactionId,
    amount,
    status: "Initiated",
  });

  try {
    const sslRes = await axios.post(process.env.SSLC_API_URL, paymentData);
    res.json(sslRes.data);
  } catch (error) {
    console.error("❌ SSLCommerz Init Error:", error.response?.data || error.message);
    res.status(500).json({ error: "SSLCommerz payment initiation failed" });
  }
});

// ✅ Success URL Handler
router.get('/success', async (req, res) => {
  const { tran_id } = req.query;
  await Transaction.findOneAndUpdate({ transactionId: tran_id }, { status: "Success" });
  res.redirect('http://localhost:3000/payment/success');
});

// ❌ Failure URL Handler
router.get('/fail', async (req, res) => {
  const { tran_id } = req.query;
  await Transaction.findOneAndUpdate({ transactionId: tran_id }, { status: "Failed" });
  res.redirect('http://localhost:3000/payment/fail');
});

export default router;
