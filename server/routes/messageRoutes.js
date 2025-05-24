import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  startConversationFromListing,
  getConversations,
  getMessages,
  sendMessage
} from '../controllers/messageController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get messages for a conversation
router.get('/conversations/:conversationId', getMessages);

// Start a conversation from a listing
router.post('/conversations/listing/:listingId', startConversationFromListing);

// Send a message in a conversation
router.post('/conversations/:conversationId/messages', sendMessage);

export default router;