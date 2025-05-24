
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceType: { 
    type: String, 
    enum: ['fixed', 'bidding', 'hourly'], 
    default: 'fixed' 
  },
  startingBid: { type: Number },
  currentBid: { type: Number },
  hourlyRate: { type: Number },
  category: { 
    type: String, 
    enum: ['textbooks', 'electronics', 'transport', 'tutoring', 'skill-exchange'],
    required: true
  },
  condition: { 
    type: String, 
    enum: ['new', 'like new', 'good', 'fair'] 
  },
  university: { 
    type: String, 
    enum: ['IUT', 'DU', 'BUET', 'NSU', 'BRAC'],
    required: true
  },
  visibility: { 
    type: String, 
    enum: ['university', 'all'],
    default: 'university'
  },
  images: [{ type: String }],
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;