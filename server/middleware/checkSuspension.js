import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './async.js';

const checkSuspension = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return next();
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended',
        reason: user.suspensionReason,
        suspendedAt: user.suspendedAt
      });
    }

    next();
  } catch (error) {
    console.error('Error checking user suspension:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking user suspension',
      error: error.message
    });
  }
});

export default checkSuspension; 