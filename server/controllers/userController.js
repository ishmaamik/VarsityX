// controllers/userController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

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
    res.status(500).json({ 
      success: false,
      message: "Registration failed",
      error: err.message
    });
  }
};

// Enhanced login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Omit password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ 
      success: true,
      token,
      user: userResponse 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === "development" ? err.message : undefined
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
    const user = await User.findById(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};