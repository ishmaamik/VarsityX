import Listing from '../models/Listing.js';
import mongoose from 'mongoose';

// Get all listings with filters
export const getListings = async (req, res) => {
  try {
    const { 
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = { status: 'available' };
    
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const listings = await Listing.find(filter)
      .populate('seller', 'displayName email photo')
      .sort(sort)
      .lean();

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Error getting listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    const listing = await Listing.findById(id)
      .populate('seller', 'displayName email photo')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'displayName photo'
        }
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error getting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message
    });
  }
};

// Create new listing
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      photos
    } = req.body;

    const listing = new Listing({
      title,
      description,
      price,
      category,
      condition,
      location,
      photos,
      seller: req.user.userId
    });

    await listing.save();
    await listing.populate('seller', 'displayName email photo');

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    // Ensure user owns the listing
    const listing = await Listing.findOne({
      _id: id,
      seller: req.user.userId
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or unauthorized'
      });
    }

    // Update the listing
    Object.assign(listing, updates);
    await listing.save();
    await listing.populate('seller', 'displayName email photo');

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating listing',
      error: error.message
    });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID'
      });
    }

    // Ensure user owns the listing
    const listing = await Listing.findOneAndDelete({
      _id: id,
      seller: req.user.userId
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting listing',
      error: error.message
    });
  }
}; 