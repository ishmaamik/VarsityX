// controllers/userController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';

// Register with JWT
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }
    const allowedDomain = /\.edu$/;

    if (!allowedDomain.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Registration allowed only with a valid university (.edu) email address."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName: email.split("@")[0],
      role: "User"
    });

    await newUser.save();

    // Generate token with expiration
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Omit password in response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true,
      token,
      user: userResponse 
    });
  } catch (err) {
    console.log(err)
  }
};

// Enhanced login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended',
        reason: user.suspensionReason
      });
    }

    // Verify password exists
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Prepare user response without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Google OAuth Callback Logic
export const googleOAuth = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.redirect(`http://localhost:5173/google-success?token=${token}`);
};

// Get User Data (accessible by both User and Admin)
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('university');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// Add this function to your existing userController.js
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.userId;

    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query is required' 
      });
    }

    // First, get all conversations of current user to exclude those users
    const existingConversations = await Conversation.find({
      participants: currentUserId
    });

    // Get all participant IDs except current user
    const existingParticipantIds = existingConversations
      .map(conv => conv.participants)
      .flat()
      .filter(id => id.toString() !== currentUserId)
      .map(id => id.toString());

    // Search users by displayName or email, excluding current user and existing conversations
    const users = await User.find({
      $and: [
        {
          $or: [
            { displayName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        },
        { _id: { $ne: currentUserId } }, // Exclude current user
        { _id: { $nin: existingParticipantIds } } // Exclude users from existing conversations
      ]
    })
    .select('displayName email photo')
    .limit(10);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
};

// Update user's university
export const updateUniversity = async (req, res) => {
  try {
    const { university } = req.body;
    
    if (!university) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a university ID'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { university },
      { new: true, runValidators: true }
    ).populate('university');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update university',
      error: err.message
    });
  }
};

// @desc    Get users by university
// @route   GET /api/users/university/:university
// @access  Private (Admin/StudentAdmin only)
export const getUsersByUniversity = async (req, res) => {
  try {
    const { university } = req.params;
    
    const users = await User.find({ 
      university,
      role: 'User' // Only get regular users, not admins
    })
    .select('displayName email university')
    .sort('displayName');

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching university users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching university users'
    });
  }
};