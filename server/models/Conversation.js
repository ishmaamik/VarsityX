import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCounts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    count: {
      type: Number,
      default: 0
    }
  }]
}, { timestamps: true });

// Ensure participants array always has exactly 2 users
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('A conversation must have exactly 2 participants'));
  }
  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation; 