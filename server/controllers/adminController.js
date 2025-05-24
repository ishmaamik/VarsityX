// controllers/adminController.js
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// Admin-specific data (for demonstration)
export const getAdminData = async (req, res) => {
  try {
    // Fetch some admin-specific data (e.g., all users, statistics, etc.)
    const users = await User.find();  // Admin can view all users
    res.json({ users });  // Send back the list of users
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin function to manage users (e.g., activating, deactivating users)
export const manageUsers = async (req, res) => {
  try {
    const { userId, action } = req.body; // Example action: 'activate', 'deactivate', etc.
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Example: change user status based on action
    if (action === 'deactivate') {
      user.isActive = false;
    } else if (action === 'activate') {
      user.isActive = true;
    }

    await user.save();  // Save the updated user data
    res.json({ message: `User ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin dashboard stats
export const getDashboardStats = asyncHandler(async (req, res, next) => {
    const [listingsStats, usersStats] = await Promise.all([
        Listing.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]),
        User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    const stats = {
        listings: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        },
        users: {
            total: 0,
            studentAdmins: 0,
            suspended: 0
        }
    };

    listingsStats.forEach(stat => {
        if (stat._id) {
            stats.listings[stat._id] = stat.count;
            stats.listings.total += stat.count;
        }
    });

    usersStats.forEach(stat => {
        if (stat._id === 'student-admin') {
            stats.users.studentAdmins = stat.count;
        }
        stats.users.total += stat.count;
    });

    const suspendedCount = await User.countDocuments({ isSuspended: true });
    stats.users.suspended = suspendedCount;

    res.status(200).json({
        success: true,
        data: stats
    });
});

// Get pending listings
export const getPendingListings = asyncHandler(async (req, res, next) => {
    const listings = await Listing.find({ 
        status: 'pending',
        university: req.user.role === 'student-admin' ? req.user.university : { $exists: true }
    })
    .populate('seller', 'displayName email photo')
    .populate('university', 'name');

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
    });
});

// Moderate listing
export const moderateListing = asyncHandler(async (req, res, next) => {
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return next(new ErrorResponse('Invalid moderation action', 400));
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ErrorResponse('Listing not found', 404));
    }

    // Check if student admin has permission for this university
    if (req.user.role === 'student-admin' && listing.university.toString() !== req.user.university.toString()) {
        return next(new ErrorResponse('Not authorized to moderate listings from other universities', 403));
    }

    listing.status = action === 'approve' ? 'approved' : 'rejected';
    listing.moderationDetails = {
        moderatedBy: req.user._id,
        moderatedAt: Date.now(),
        reason,
        action
    };

    await listing.save();

    res.status(200).json({
        success: true,
        data: listing
    });
});

// Get users with poor ratings
export const getPoorRatedUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({
        averageRating: { $lt: 3 },
        totalRatings: { $gt: 2 },
        university: req.user.role === 'student-admin' ? req.user.university : { $exists: true }
    })
    .populate('university', 'name')
    .select('displayName email photo averageRating totalRatings university');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// Suspend user
export const suspendUser = asyncHandler(async (req, res, next) => {
    const { reason } = req.body;

    if (!reason) {
        return next(new ErrorResponse('Please provide a reason for suspension', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Check if student admin has permission for this university
    if (req.user.role === 'student-admin' && user.university.toString() !== req.user.university.toString()) {
        return next(new ErrorResponse('Not authorized to suspend users from other universities', 403));
    }

    user.isSuspended = true;
    user.suspensionReason = reason;
    user.suspensionDate = Date.now();
    user.suspendedBy = req.user._id;

    await user.save();

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get student admins
export const getStudentAdmins = asyncHandler(async (req, res, next) => {
    const studentAdmins = await User.find({ 
        role: 'student-admin',
        university: req.user.role === 'student-admin' ? req.user.university : { $exists: true }
    })
    .populate('university', 'name')
    .select('displayName email photo university');

    res.status(200).json({
        success: true,
        count: studentAdmins.length,
        data: studentAdmins
    });
});

// Assign student admin role
export const assignStudentAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.role === 'admin') {
        return next(new ErrorResponse('Cannot modify admin role', 400));
    }

    user.role = 'student-admin';
    await user.save();

    res.status(200).json({
        success: true,
        data: user
    });
});

// Remove student admin role
export const removeStudentAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.role === 'admin') {
        return next(new ErrorResponse('Cannot modify admin role', 400));
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({
        success: true,
        data: user
    });
});
