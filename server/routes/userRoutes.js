// routes/userRoutes.js
import express from 'express';
import passport from 'passport';
import { login, register, googleOAuth, getUserData } from '../controllers/userController.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleOAuth);
router.get('/user-data', authorizeRole(['User', 'Admin']), getUserData);

export default router;