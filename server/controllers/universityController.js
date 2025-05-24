import University from '../models/University.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
export const getUniversities = asyncHandler(async (req, res, next) => {
    try {
        const universities = await University.find().select('name').sort('name');
        
        res.status(200).json({
            success: true,
            data: universities
        });
    } catch (error) {
        next(new ErrorResponse('Error fetching universities', 500));
    }
}); 