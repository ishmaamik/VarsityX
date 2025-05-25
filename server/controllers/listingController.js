import Listing from '../models/Listing.js';
import User from '../models/User.js';
import StudentAdmin from '../models/StudentAdmin.js';

export {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  placeBid,
  getPendingListings,
  moderateListing,
  getListingStats,
  getApprovedListings
};

// Create a new listing
const createListing = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      condition, 
      university, 
      images, 
      priceType, 
      visibility,
      price,
      startingBid,
      hourlyRate
    } = req.body;
    
    const seller = req.user.userId;

    // Create listing object based on price type
    const listingData = {
      title,
      description,
      category,
      condition,
      university,
      images,
      visibility,
      seller,
      priceType
    };

    // Add appropriate price field based on price type
    if (priceType === 'fixed') {
      listingData.price = Number(price);
    } else if (priceType === 'bidding') {
      listingData.startingBid = Number(startingBid);
      listingData.currentBid = Number(startingBid);
    } else if (priceType === 'hourly') {
      listingData.hourlyRate = Number(hourlyRate);
    }

    const newListing = new Listing(listingData);
    const savedListing = await newListing.save();

    // Add listing to user's listings
    await User.findByIdAndUpdate(seller, {
      $push: { listings: savedListing._id }
    });

    res.status(201).json({
      success: true,
      listing: savedListing
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create listing'
    });
  }
};

// Get all listings with filters
const getListings = async (req, res) => {
  try {
    const { search, category, university, condition, minPrice, maxPrice, sortBy, includeOwn = false, onlyOwn = false } = req.query;
    
    // Build the query object
    let query = { status: 'active' };
    
    // Handle user's own listings
    if (req.user) {
      if (onlyOwn === 'true') {
        // Only show user's own listings
        query.seller = req.user.userId;
        // Show all statuses for own listings
        delete query.status;
      } else if (includeOwn !== 'true') {
        // Exclude user's own listings
        query.seller = { $ne: req.user.userId };
      }
    }
    
    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Apply condition filter
    if (condition && condition !== 'Condition') {
      query.condition = condition.toLowerCase();
    }
    
    // Apply price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Apply visibility and university filter
    if (req.user && !onlyOwn) { // Skip visibility check for own listings
      const user = await User.findById(req.user.userId);
      if (user?.university) {
        // Show all public listings AND university-specific listings for user's university
        const visibilityQuery = [
          { visibility: 'all' },
          { 
            $and: [
              { visibility: 'university' },
              { university: user.university }
            ]
          }
        ];

        // If we already have an $or query for search, we need to combine them
        if (query.$or) {
          const searchQuery = query.$or;
          delete query.$or;
          query.$and = [
            { $or: searchQuery },
            { $or: visibilityQuery }
          ];
        } else {
          query.$or = visibilityQuery;
        }

        // If university filter is applied
        if (university && university !== 'all') {
          query = {
            $and: [
              { university },
              query
            ]
          };
        }
      } else {
        // If user has no university, only show public listings
        query.visibility = 'all';
        if (university && university !== 'all') {
          query.university = university;
        }
      }
    }
    
    // Set sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'price-low') sortOption = { price: 1 };
    if (sortBy === 'price-high') sortOption = { price: -1 };
    
    console.log('Query:', JSON.stringify(query, null, 2)); // Debug log
    
    // Execute query
    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate('seller', 'displayName university rating');
    
    console.log('Found listings:', listings.length); // Debug log
    
    res.json({
      success: true,
      count: listings.length,
      listings
    });
    
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: err.message
    });
  }
};

// Get listing details
const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'displayName university rating listings createdAt')
      .populate('reviews');
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    res.json({
      success: true,
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: err.message
    });
  }
};

// Update listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Check if the user is the seller or admin
    if (listing.seller.toString() !== req.user.userId && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({
      success: true,
      listing: updatedListing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: err.message
    });
  }
};

// Delete listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Check if the user is the seller or admin
    if (listing.seller.toString() !== req.user.userId && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    
    // Remove listing from user's listings
    await User.findByIdAndUpdate(listing.seller, {
      $pull: { listings: listing._id }
    });
    
    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: err.message
    });
  }
};

// Place a bid on a listing
const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    if (listing.priceType !== 'bidding') {
      return res.status(400).json({
        success: false,
        message: 'This listing does not accept bids'
      });
    }
    
    if (amount <= listing.currentBid) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be higher than current bid'
      });
    }
    
    listing.currentBid = amount;
    listing.bids.push({
      bidder: req.user.userId,
      amount,
      time: new Date()
    });
    
    await listing.save();
    
    res.json({
      success: true,
      message: 'Bid placed successfully',
      listing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to place bid',
      error: err.message
    });
  }
};

// Get pending listings for admin/student-admin
const getPendingListings = async (req, res) => {
  try {
    let query = { status: 'pending' };
    
    // If student admin, only show listings from their university
    if (req.user.role === 'StudentAdmin') {
      const studentAdmin = await StudentAdmin.findOne({ user: req.user.userId });
      if (!studentAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized as student admin'
        });
      }
      query.university = studentAdmin.university;
    }

    const listings = await Listing.find(query)
      .populate('seller', 'displayName email university')
      .sort('-createdAt');

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending listings'
    });
  }
};

// Moderate listing (approve/reject)
const moderateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be either approve or reject'
      });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if student admin has permission for this university
    if (req.user.role === 'StudentAdmin') {
      const studentAdmin = await StudentAdmin.findOne({ user: req.user.userId });
      if (!studentAdmin || listing.university !== studentAdmin.university) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to moderate this listing'
        });
      }

      // Update student admin stats
      if (action === 'approve') {
        studentAdmin.moderationStats.listingsApproved += 1;
      } else {
        studentAdmin.moderationStats.listingsRejected += 1;
      }
      await studentAdmin.save();
    }

    // Update listing
    listing.status = action === 'approve' ? 'active' : 'rejected';
    listing.moderatedBy = req.user.userId;
    listing.moderatedAt = new Date();
    if (action === 'reject') {
      listing.rejectionReason = reason;
    }
    await listing.save();

    res.json({
      success: true,
      message: `Listing ${action}d successfully`
    });
  } catch (error) {
    console.error('Error moderating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating listing'
    });
  }
};

// Get listing stats for admin dashboard
const getListingStats = async (req, res) => {
  try {
    let query = {};
    
    // If student admin, only count listings from their university
    if (req.user.role === 'StudentAdmin') {
      const studentAdmin = await StudentAdmin.findOne({ user: req.user.userId });
      if (!studentAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized as student admin'
        });
      }
      query.university = studentAdmin.university;
    }

    const stats = await Listing.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || { total: 0, pending: 0, active: 0, rejected: 0 }
    });
  } catch (error) {
    console.error('Error getting listing stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting listing stats'
    });
  }
};

// Get approved listings
const getApprovedListings = async (req, res) => {
  // ... existing code ...
};
