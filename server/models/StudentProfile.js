import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Academic Information (Public)
  university: {
    type: String,
    required: true
  },
  department: {
    type: String,
    trim: true
  },
  program: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 5
  },
  bio: {
    type: String,
    maxlength: 500
  },
  // Privacy Settings
  isProfilePublic: {
    type: Boolean,
    default: true
  },
  showDepartment: {
    type: Boolean,
    default: true
  },
  showProgram: {
    type: Boolean,
    default: true
  },
  showYearOfStudy: {
    type: Boolean,
    default: true
  },
  // Private Information (Admin Only)
  privateInfo: {
    phoneNumber: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    studentId: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
StudentProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('StudentProfile', StudentProfileSchema); 