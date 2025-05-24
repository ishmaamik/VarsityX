import express from 'express';
import { stripeCheckout } from '../controllers/stripeController.js';
import { sslcommerzCheckout } from '../controllers/sslcommerzController.js';

const router = express.Router();

router.post('/stripe', stripeCheckout);
router.post('/sslcommerz', sslcommerzCheckout);

export default router;
