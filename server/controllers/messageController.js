import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'displayName email photo')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }

    // Reset unread count for this user
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        'unreadCounts.$[elem].count': 0
      }
    }, {
      arrayFilters: [{ 'elem.user': userId }]
    });

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'displayName email photo')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.userId;

    // Debug logging
    console.log('Creating conversation with:', {
      userId,
      participantId,
      body: req.body,
      user: req.user
    });

    // Input validation
    if (!participantId) {
      return res.status(400).json({ 
        message: 'participantId is required',
        success: false 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        message: 'User ID not found in token',
        success: false 
      });
    }

    // Validate user IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        success: false,
        details: { userId, participantId }
      });
    }

    // Convert string IDs to ObjectIds
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const participantObjectId = new mongoose.Types.ObjectId(participantId);

    // Prevent creating conversation with self
    if (userId === participantId) {
      return res.status(400).json({ 
        message: 'Cannot create conversation with yourself',
        success: false 
      });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userObjectId, participantObjectId] }
    })
    .populate('participants', 'displayName email photo')
    .populate('lastMessage');

    if (existingConversation) {
      return res.json({
        success: true,
        data: existingConversation
      });
    }

    // Create new conversation with proper ObjectIds
    const conversation = new Conversation({
      participants: [userObjectId, participantObjectId],
      unreadCounts: [
        { user: userObjectId, count: 0 },
        { user: participantObjectId, count: 0 }
      ]
    });

    await conversation.save();
    
    // Populate the participants after saving
    await conversation.populate('participants', 'displayName email photo');
    await conversation.populate('lastMessage');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      message: 'Error creating conversation',
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, image } = req.body;
    const userId = req.user.userId;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(conversationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Convert to ObjectIds
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationObjectId,
      participants: userObjectId
    }).populate('participants', '_id displayName email photo');

    if (!conversation) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    // Create and save the message
    const message = new Message({
      conversation: conversationObjectId,
      sender: userObjectId,
      text,
      image
    });

    await message.save();
    
    // Populate the message with sender details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', '_id displayName email photo');

    // Update conversation's last message and increment unread count for other participant
    await Conversation.findByIdAndUpdate(conversationObjectId, {
      lastMessage: message._id,
      $inc: {
        'unreadCounts.$[elem].count': 1
      }
    }, {
      arrayFilters: [{ 'elem.user': { $ne: userObjectId } }]
    });

    // Get updated conversation with populated fields
    const updatedConversation = await Conversation.findById(conversationObjectId)
      .populate('participants', '_id displayName email photo')
      .populate('lastMessage');

    // Emit socket events
    if (req.io) {
      // Emit new message to the conversation room
      req.io.to(conversationId).emit('new_message', {
        message: populatedMessage,
        conversationId
      });

      // Emit conversation update to both participants
      conversation.participants.forEach(participant => {
        req.io.to(participant._id.toString()).emit('conversation_update', updatedConversation);
      });
    }

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
}; 