import Listing from '../models/Listing.js';
import User from '../models/User.js';

// Create a new listing
export const createListing = async (req, res) => {
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
export const getListings = async (req, res) => {
  try {
    const { search, category, university, condition, minPrice, maxPrice, sortBy } = req.query;
    
    // Build the query object
    let query = { status: 'active' };
    
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
    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user?.university) {
        // Show all public listings AND university-specific listings for user's university
        query.$or = [
          { visibility: 'all' },
          { 
            $and: [
              { visibility: 'university' },
              { university: user.university }
            ]
          }
        ];

        // If university filter is applied
        if (university && university !== 'all') {
          // Show only listings from the selected university that are either:
          // 1. Public listings from that university OR
          // 2. University-specific listings if user is from that university
          query = {
            $and: [
              { university },
              {
                $or: [
                  { visibility: 'all' },
                  {
                    $and: [
                      { visibility: 'university' },
                      { university: user.university }
                    ]
                  }
                ]
              }
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
    } else {
      // If not logged in, only show public listings
      query.visibility = 'all';
      if (university && university !== 'all') {
        query.university = university;
      }
    }
    
    // Set sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'price-low') sortOption = { price: 1 };
    if (sortBy === 'price-high') sortOption = { price: -1 };
    
    // Execute query
    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate('seller', 'displayName university rating');
    
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
export const getListing = async (req, res) => {
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
export const updateListing = async (req, res) => {
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
export const deleteListing = async (req, res) => {
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
export const placeBid = async (req, res) => {
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
