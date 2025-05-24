import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const {
            university,
            program,
            yearOfStudy,
            bio
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                university,
                program,
                yearOfStudy,
                bio
            },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

export default router; 