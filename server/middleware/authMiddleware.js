// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is banned
      if (user.isBanned) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been banned. Please contact support for more information.',
          reason: user.banReason
        });
      }

      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        university: user.university
      };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export const isStudentAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'StudentAdmin' && user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Student admin access required'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};