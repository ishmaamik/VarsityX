import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  displayName: { type: String },
  email: { type: String},
  photo: { type: String, default: "" },
  university: { 
    type: String, 
    enum: ['IUT', 'DU', 'BUET', 'NSU', 'BRAC'] 
  },
  role: { 
    type: String, 
    enum: ['User', 'Admin'], 
    default: 'User'
  },
  password: { type: String },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  cart: [{
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    quantity: { type: Number, default: 1 }
  }],
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;