import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

export const sslcommerzCheckout = async (req, res) => {
  const { amount, email } = req.body;

  const transactionId = uuidv4();
  const data = {
    store_id: process.env.SSLC_STORE_ID,
    store_passwd: process.env.SSLC_PASS,
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `http://localhost:3000/payment/success`,
    fail_url: `http://localhost:3000/payment/fail`,
    cancel_url: `http://localhost:3000/payment/fail`,
    cus_name: 'Customer Name',
    cus_email: email,
    cus_add1: 'Dhaka',
    cus_phone: '01711111111',
    shipping_method: 'NO',
    product_name: 'Marketplace Item',
    product_category: 'General',
    product_profile: 'general',
  };

  try {
    const response = await axios.post(`${process.env.SSLC_API_URL}/gwprocess/v4/api.php`, data);
    res.status(200).json({ url: response.data.GatewayPageURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
