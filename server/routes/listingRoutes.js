import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import {
  getPendingListings,
  getApprovedListings,
  moderateListing,
  getListingStats
} from '../controllers/listingController.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Admin/StudentAdmin routes
router.get('/pending',
  authorizeRole(['Admin', 'StudentAdmin']),
  getPendingListings
);

router.get('/approved',
  authorizeRole(['Admin', 'StudentAdmin']),
  getApprovedListings
);

router.get('/stats',
  authorizeRole(['Admin', 'StudentAdmin']),
  getListingStats
);

router.post('/:id/moderate',
  authorizeRole(['Admin', 'StudentAdmin']),
  moderateListing
);

export default router; 