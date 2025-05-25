import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getStudentProfile,
  updateStudentProfile,
  getOwnProfile
} from '../controllers/studentProfileController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Get own profile
router.get('/me', getOwnProfile);

// Get student profile by ID
router.get('/:userId', getStudentProfile);

// Update own profile
router.put('/me', updateStudentProfile);

export default router; 