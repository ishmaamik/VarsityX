import Review from '../models/Review.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { type, targetId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if user has already reviewed
    const existingReview = await Review.findOne({
      user: userId,
      type,
      targetId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    // Handle image uploads if any
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.path));
      images = await Promise.all(uploadPromises);
    }

    // Check if it's a verified purchase
    let isVerifiedPurchase = false;
    if (type === 'product') {
      const listing = await Listing.findById(targetId);
      isVerifiedPurchase = listing && listing.buyer && listing.buyer.toString() === userId.toString();
    }

    const review = await Review.create({
      user: userId,
      type,
      targetId,
      rating,
      comment,
      images,
      isVerifiedPurchase
    });

    // Populate user details
    await review.populate('user', 'name email university isVerified');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get reviews for a product or seller
export const getReviews = async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const { sort = 'recent', page = 1, limit = 10 } = req.query;

    const query = { type, targetId };
    const sortOptions = {
      recent: { createdAt: -1 },
      helpful: { helpful: -1 },
      highest: { rating: -1 },
      lowest: { rating: 1 }
    };

    const reviews = await Review.find(query)
      .sort(sortOptions[sort])
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email university isVerified profileImage')
      .populate('replies.user', 'name email university isVerified profileImage');

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
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
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the review author
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Handle new image uploads if any
    let images = review.images;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.path));
      const newImages = await Promise.all(uploadPromises);
      images = [...images, ...newImages];
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.images = images;
    review.updatedAt = Date.now();

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
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
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the review author or an admin
    if (review.user.toString() !== userId.toString()) {
      const user = await User.findById(userId);
      if (!user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }
    }

    await review.remove();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Mark a review as helpful
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const helpfulIndex = review.helpful.indexOf(userId);
    if (helpfulIndex === -1) {
      review.helpful.push(userId);
    } else {
      review.helpful.splice(helpfulIndex, 1);
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful',
      error: error.message
    });
  }
};

// Add a reply to a review
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.replies.push({
      user: userId,
      comment
    });

    await review.save();
    await review.populate('replies.user', 'name email university isVerified profileImage');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
};

// Get reviews by the authenticated user
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      $or: [
        { seller: req.user._id },
        { buyer: req.user._id }
      ]
    })
    .populate('seller buyer listing')
    .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};