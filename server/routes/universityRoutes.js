import express from 'express';
import { getUniversities, addUniversity } from '../controllers/universityController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', getUniversities);

// Protected routes
router.use(authenticate);
router.use(authorizeRole(['Admin']));

router.post('/', addUniversity);

export default router; 