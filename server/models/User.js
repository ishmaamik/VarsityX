// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String},
  displayName: { type: String},
  email: { type: String},
  photo: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ['User', 'Admin'], 
    default: 'User' // Default role is 'User'
  },
  password: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
