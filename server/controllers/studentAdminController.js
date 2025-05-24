import StudentAdmin from '../models/StudentAdmin.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Assign student admin role
export const assignStudentAdmin = async (req, res) => {
  try {
    const { userId, universityId } = req.body;

    // Check if user exists and is not already an admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create student admin
    const studentAdmin = new StudentAdmin({
      user: userId,
      university: universityId
    });

    await studentAdmin.save();

    // Update user role
    user.role = 'StudentAdmin';
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Student admin assigned successfully',
      data: studentAdmin
    });

  } catch (error) {
    console.error('Error assigning student admin:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning student admin'
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