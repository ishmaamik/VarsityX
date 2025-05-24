import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  price: {
    type: Number
  },
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
    required: [true, 'Please provide a category'],
    enum: ['textbooks', 'electronics', 'transport', 'tutoring', 'skill-exchange']
  },
  condition: {
    type: String,
    enum: ['new', 'like new', 'good', 'fair'],
    required: function() {
      return this.category === 'textbooks' || this.category === 'electronics';
    }
  },
  university: {
    type: String,
    required: true,
    enum: ['IUT', 'DU', 'BUET', 'NSU', 'BRAC']
  },
  visibility: { 
    type: String, 
    enum: ['university', 'all'],
    default: 'university'
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'sold', 'deleted'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,
  views: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

// Virtual populate for reviews
listingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing'
});

// Update timestamps
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;