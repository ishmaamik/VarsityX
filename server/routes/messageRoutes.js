import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getConversations,
  getMessages,
  createConversation,
  sendMessage
} from '../controllers/messageController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all conversations for the authenticated user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', getMessages);

// Create a new conversation
router.post('/conversations', createConversation);

// Send a message in a conversation
router.post('/conversations/:conversationId/messages', sendMessage);

export default router;