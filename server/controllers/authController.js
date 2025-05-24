import User from '../models/User.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
    const { email, password, displayName, university } = req.body;

    // Validate university
    if (!university) {
        return next(new ErrorResponse('Please select a university', 400));
    }

    // Create user
    const user = await User.create({
        email,
        password,
        displayName,
        university
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token,
        data: {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            university: user.university,
            photo: user.photo,
            role: user.role
        }
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('university', 'name');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is suspended
    if (user.isSuspended) {
        return next(new ErrorResponse('Your account has been suspended', 403));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token,
        data: {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            university: user.university,
            photo: user.photo,
            role: user.role
        }
    });
}); 