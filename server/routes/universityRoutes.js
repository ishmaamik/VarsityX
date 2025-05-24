import express from 'express';
import { getUniversities } from '../controllers/universityController.js';

const router = express.Router();

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', getUniversities);

export default router; 