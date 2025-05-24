import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['text', 'file'],
    default: 'text'
  },
  file: {
    url: {
      type: String
    },
    type: {
      type: String,
      enum: ['image', 'pdf']
    }
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message; 