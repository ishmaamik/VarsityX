import mongoose from 'mongoose';

const studentAdminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  university: {
    type: String,
    required: true,
    enum: ['IUT', 'BUET', 'DU', 'BRAC', 'NSU']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  moderationStats: {
    listingsApproved: { type: Number, default: 0 },
    listingsRejected: { type: Number, default: 0 },
    usersSuspended: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one user can only be admin for one university
studentAdminSchema.index({ user: 1 }, { unique: true });

const StudentAdmin = mongoose.model('StudentAdmin', studentAdminSchema);

export default StudentAdmin; 