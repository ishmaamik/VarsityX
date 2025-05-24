
import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authorizeRole(['User']), createOrder);
router.get('/', authorizeRole(['User', 'Admin']), getOrders);
router.get('/:id', authorizeRole(['User', 'Admin']), getOrder);
router.put('/:id/status', authorizeRole(['User', 'Admin']), updateOrderStatus);

export default router;