
import Review from '../models/Review.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// Create a review
export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Check if user has purchased this listing
    const hasPurchased = await Order.exists({
      buyer: req.user.userId,
      'items.listing': listingId,
      status: 'completed'
    });
    
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review items you have purchased'
      });
    }
    
    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      reviewer: req.user.userId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this listing'
      });
    }
    
    const newReview = new Review({
      listing: listingId,
      reviewer: req.user.userId,
      rating,
      comment
    });
    
    await newReview.save();
    
    // Add review to listing
    listing.reviews.push(newReview._id);
    await listing.save();
    
    // Update seller's rating
    await User.findByIdAndUpdate(listing.seller, {
      $inc: { ratingCount: 1, ratingSum: rating }
    });
    
    res.status(201).json({
      success: true,
      review: newReview
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: err.message
    });
  }
};

// Get reviews for a listing
export const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('reviewer', 'displayName photo');
    
    res.json({
      success: true,
      reviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: err.message
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    // Update rating difference in seller's profile
    if (rating !== review.rating) {
      await User.findByIdAndUpdate(review.listing.seller, {
        $inc: { ratingSum: rating - review.rating }
      });
    }
    
    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    res.json({
      success: true,
      review
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: err.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is the reviewer or admin
    if (review.reviewer.toString() !== req.user.userId && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    // Remove rating from seller's profile
    await User.findByIdAndUpdate(review.listing.seller, {
      $inc: { ratingCount: -1, ratingSum: -review.rating }
    });
    
    // Remove review from listing
    await Listing.findByIdAndUpdate(review.listing, {
      $pull: { reviews: review._id }
    });
    
    await review.remove();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: err.message
    });
  }
};