import Review from '../models/Review.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user.userId;

    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      reviewer: reviewerId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this listing'
      });
    }

    // Create new review
    const review = new Review({
      listing: listingId,
      reviewer: reviewerId,
      rating,
      comment
    });

    await review.save();
    await review.populate('reviewer', 'displayName photo');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get reviews for a listing
export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    const reviews = await Review.find({ listing: listingId })
      .populate('reviewer', 'displayName photo')
      .sort('-createdAt');

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      reviewer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();
    await review.populate('reviewer', 'displayName photo');

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      reviewer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};