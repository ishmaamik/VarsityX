import University from '../models/University.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort('name');
    
    res.json({
      success: true,
      data: universities
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching universities'
    });
  }
};

// Add a university
export const addUniversity = async (req, res) => {
  try {
    const { name } = req.body;

    // Create university with name as _id
    const university = await University.create({ 
      _id: name,
      name 
    });

    res.status(201).json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error adding university:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'University already exists' : 'Error adding university'
    });
  }
}; 