
import express from 'express';
import { 
  createReview, 
  getListingReviews, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/listing/:listingId', getListingReviews);
router.post('/', authorizeRole(['User']), createReview);
router.put('/:id', authorizeRole(['User', 'Admin']), updateReview);
router.delete('/:id', authorizeRole(['User', 'Admin']), deleteReview);

export default router;