import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import {
  assignStudentAdmin,
  getUniversityAdmins,
  moderateListing,
  suspendUser
} from '../controllers/studentAdminController.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes for super admins only
router.post('/assign', authorizeRole(['Admin']), assignStudentAdmin);
router.get('/university/:universityId', authorizeRole(['Admin']), getUniversityAdmins);

// Routes for student admins
router.post('/listings/:listingId/moderate', authorizeRole(['StudentAdmin']), moderateListing);
router.post('/users/:userId/suspend', authorizeRole(['StudentAdmin']), suspendUser);

export default router; 