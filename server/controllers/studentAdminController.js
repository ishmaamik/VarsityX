import StudentAdmin from '../models/StudentAdmin.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import ErrorResponse from '../utils/errorResponse.js';

// Get student admins for a university
export const getUniversityStudentAdmins = async (req, res) => {
  try {
    const { university } = req.params;
    
    const studentAdmins = await StudentAdmin.find({ university })
      .populate('user', 'displayName email');

    res.json({
      success: true,
      data: studentAdmins
    });
  } catch (error) {
    console.error('Error fetching student admins:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student admins'
    });
  }
};

// Assign student admin
export const assignStudentAdmin = async (req, res) => {
  try {
    const { userId, university } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user belongs to the university
    if (user.university !== university) {
      return res.status(400).json({
        success: false,
        message: 'User does not belong to this university'
      });
    }

    // Check if already a student admin
    const existingAdmin = await StudentAdmin.findOne({ user: userId });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User is already a student admin'
      });
    }

    // Create student admin
    const studentAdmin = await StudentAdmin.create({
      user: userId,
      university,
      moderationStats: {
        listingsApproved: 0,
        listingsRejected: 0,
        usersSuspended: 0
      }
    });

    // Update user role
    user.role = 'StudentAdmin';
    await user.save();

    await studentAdmin.populate('user', 'displayName email');

    res.status(201).json({
      success: true,
      data: studentAdmin
    });
  } catch (error) {
    console.error('Error assigning student admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning student admin'
    });
  }
};

// Get student admins by university
export const getUniversityAdmins = async (req, res) => {
  try {
    const { universityId } = req.params;
    
    const admins = await StudentAdmin.find({ university: universityId })
      .populate('user', 'displayName email')
      .sort('-createdAt');

    res.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error('Error getting university admins:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting university admins'
    });
  }
};

// Moderate listing (for student admins)
export const moderateListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { action, reason } = req.body;
    const studentAdminId = req.user.userId;

    // Verify student admin status and university match
    const studentAdmin = await StudentAdmin.findOne({ user: studentAdminId });
    if (!studentAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as student admin'
      });
    }

    const listing = await Listing.findById(listingId)
      .populate('seller', 'university');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Ensure admin is from same university as listing
    if (listing.seller.university.toString() !== studentAdmin.university.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to moderate listings from other universities'
      });
    }

    // Update listing status
    listing.status = action === 'approve' ? 'active' : 'rejected';
    if (action === 'reject') {
      listing.rejectionReason = reason;
    }
    await listing.save();

    // Update moderation stats
    if (action === 'approve') {
      studentAdmin.moderationStats.listingsApproved += 1;
    } else {
      studentAdmin.moderationStats.listingsRejected += 1;
    }
    await studentAdmin.save();

    res.json({
      success: true,
      message: `Listing ${action}d successfully`
    });

  } catch (error) {
    console.error('Error moderating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating listing'
    });
  }
};

// Suspend user (for student admins)
export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const studentAdminId = req.user.userId;

    // Verify student admin status and university match
    const studentAdmin = await StudentAdmin.findOne({ user: studentAdminId });
    if (!studentAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as student admin'
      });
    }

    const userToSuspend = await User.findById(userId);
    if (!userToSuspend) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Ensure admin is from same university as user
    if (userToSuspend.university.toString() !== studentAdmin.university.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to suspend users from other universities'
      });
    }

    // Update user status
    userToSuspend.isSuspended = true;
    userToSuspend.suspensionReason = reason;
    await userToSuspend.save();

    // Update moderation stats
    studentAdmin.moderationStats.usersSuspended += 1;
    await studentAdmin.save();

    res.json({
      success: true,
      message: 'User suspended successfully'
    });

  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({
      success: false,
      message: 'Error suspending user'
    });
  }
}; 