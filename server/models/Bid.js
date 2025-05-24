import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'won', 'lost', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure bid amount is higher than current highest bid
bidSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Listing = mongoose.model('Listing');
    const listing = await Listing.findById(this.listing);
    
    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.currentBid && this.amount <= listing.currentBid) {
      throw new Error('Bid must be higher than current bid');
    }

    // Update listing's current bid
    listing.currentBid = this.amount;
    await listing.save();
  }
  next();
});

const Bid = mongoose.model('Bid', bidSchema);

export default Bid; 