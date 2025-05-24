import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Listing from '../models/Listing.js';
import mongoose from 'mongoose';

// Start a conversation with seller from listing
export const startConversationFromListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { message } = req.body;
    const buyerId = req.user.userId;

    // Get listing and check if it exists
    const listing = await Listing.findById(listingId).populate('seller');
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { 
        $all: [buyerId, listing.seller._id],
        $size: 2
      },
      listing: listingId
    });

    if (existingConversation) {
      // Add new message to existing conversation
      const newMessage = new Message({
        conversation: existingConversation._id,
        sender: buyerId,
        text: message
      });

      await newMessage.save();
      await existingConversation.populate('participants', 'displayName email photo');

      // Update last message
      existingConversation.lastMessage = newMessage;
      await existingConversation.save();

      return res.json({
        success: true,
        data: existingConversation
      });
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [buyerId, listing.seller._id],
      listing: listingId
    });

    await conversation.save();

    // Create first message
    const firstMessage = new Message({
      conversation: conversation._id,
      sender: buyerId,
      text: message
    });

    await firstMessage.save();

    // Set last message and populate participants
    conversation.lastMessage = firstMessage;
    await conversation.save();
    await conversation.populate('participants', 'displayName email photo');
    await conversation.populate('listing', 'title images');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting conversation',
      error: error.message
    });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId
    })
      .populate('participants', 'displayName email photo')
      .populate('listing', 'title images')
      .populate('lastMessage')
      .sort('-updatedAt');

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Check if user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized'
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'displayName photo')
      .sort('createdAt');

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, type } = req.body;

    // Check if user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.userId
    }).populate('participants');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized'
      });
    }

    const message = new Message({
      conversation: conversationId,
      sender: req.user.userId,
      text,
      type: type || 'text'
    });

    await message.save();
    await message.populate('sender', 'displayName photo');

    // Update conversation's last message
    conversation.lastMessage = message;
    await conversation.save();

    // Emit socket event to all participants
    const io = req.io;
    conversation.participants.forEach(participant => {
      io.to(participant._id.toString()).emit('new_message', {
        message,
        conversationId
      });
    });

    // Also emit conversation update
    conversation.participants.forEach(participant => {
      io.to(participant._id.toString()).emit('conversation_update', conversation);
    });

    res.status(201).json({
      success: true,
      data: message
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