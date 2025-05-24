import express from 'express';
import { 
  createListing, 
  getListings, 
  getListing, 
  updateListing, 
  deleteListing,
  placeBid,
  getMyListings
} from '../controllers/listingController.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListing);

// Protected routes
router.post('/', authorizeRole(['User', 'Admin']), createListing);
router.put('/:id', authorizeRole(['User', 'Admin']), updateListing);
router.delete('/:id', authorizeRole(['User', 'Admin']), deleteListing);
router.post('/:id/bid', authorizeRole(['User']), placeBid);
// router.get('/my-listings', protect, getMyListings);

export default router;