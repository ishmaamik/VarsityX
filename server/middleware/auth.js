import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token - check both id and userId fields
        const userId = decoded.id || decoded.userId;
        const user = await User.findById(userId).populate('university', 'name');

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Check if user is suspended
        if (user.isSuspended) {
            return next(new ErrorResponse('Your account has been suspended', 403));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
}; 