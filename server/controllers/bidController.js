import Bid from '../models/Bid.js';
import Listing from '../models/Listing.js';

// Place a new bid
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const listingId = req.params.id;
    const userId = req.user.userId;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid bid amount' 
      });
    }

    // Get listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: 'Listing not found' 
      });
    }

    // Check if listing is for bidding
    if (listing.priceType !== 'bidding') {
      return res.status(400).json({ 
        success: false, 
        message: 'This listing does not accept bids' 
      });
    }

    // Check if bid is higher than current bid
    if (listing.currentBid && amount <= listing.currentBid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bid must be higher than current bid' 
      });
    }

    // Create new bid
    const bid = new Bid({
      listing: listingId,
      bidder: userId,
      amount
    });

    await bid.save();

    // Populate bid with bidder info and select necessary fields
    await bid.populate('bidder', 'displayName');
    const populatedBid = await Bid.findById(bid._id)
      .populate('bidder', 'displayName')
      .select('amount bidder createdAt');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid: populatedBid
    });

  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error placing bid' 
    });
  }
};

// Get bids for a listing
export const getListingBids = async (req, res) => {
  try {
    const listingId = req.params.id;
    
    const bids = await Bid.find({ listing: listingId })
      .populate('bidder', 'displayName')
      .select('amount bidder createdAt')
      .sort('-createdAt');

    res.json({
      success: true,
      bids
    });

  } catch (error) {
    console.error('Error getting bids:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting bids' 
    });
  }
};

// Get user's bids
export const getUserBids = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const bids = await Bid.find({ bidder: userId })
      .populate('listing', 'title currentBid')
      .sort('-createdAt');

    res.json({
      success: true,
      bids
    });

  } catch (error) {
    console.error('Error getting user bids:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting user bids' 
    });
  }
}; 