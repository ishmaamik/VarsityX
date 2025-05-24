// routes/userRoutes.js
import express from 'express';
import passport from 'passport';
import { login, register, googleOAuth, getUserData, searchUsers } from '../controllers/userController.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleOAuth);
router.get('/user-data', authorizeRole(['User', 'Admin']), getUserData);

// Add search users route (protected)
router.get('/search', authenticate, searchUsers);

export default router;