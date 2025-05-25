// routes/adminRoutes.js
import express from 'express';
import { authenticate, isAdmin, isStudentAdmin } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import {
    getAdminData,
    manageUsers,
    getDashboardStats,
    getPendingListings,
    moderateListing,
    getPoorRatedUsers,
    suspendUser,
    getStudentAdmins,
    assignStudentAdmin,
    removeStudentAdmin,
    getListingStats,
    getUserStats,
    getApprovedListings
} from '../controllers/adminController.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Listing from '../models/Listing.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorizeRole(['Admin', 'StudentAdmin']));

// Admin-only routes
router.get('/admin-data', isAdmin, getAdminData);
router.post('/manage-users', isAdmin, manageUsers);
router.get('/student-admins', isAdmin, getStudentAdmins);
router.patch('/users/:id/make-student-admin', isAdmin, assignStudentAdmin);
router.patch('/users/:id/remove-student-admin', isAdmin, removeStudentAdmin);

// Get all users with optional university filter
router.get('/users', isAdmin, async (req, res) => {
  try {
    const { university } = req.query;
    const query = university ? { university } : {};
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get users by university
router.get('/users/university/:university', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ university: req.params.university })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching university users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching university users'
    });
  }
});

// Ban a user
router.patch('/users/:userId/ban', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isBanned: true,
        banReason: req.body.reason || 'Banned by administrator'
      },
      { new: true }
    ).select('-password');

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
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      success: false,
      message: 'Error banning user'
    });
  }
});

// Unban a user
router.patch('/users/:userId/unban', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isBanned: false,
        banReason: null
      },
      { new: true }
    ).select('-password');

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
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({
      success: false,
      message: 'Error unbanning user'
    });
  }
});

// Get admin dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      studentAdmins,
      totalListings,
      pendingListings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      User.countDocuments({ role: 'StudentAdmin' }),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        bannedUsers,
        studentAdmins,
        totalListings,
        pendingListings
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats'
    });
  }
});

// Routes accessible by both admin and student-admin
router.get('/listings/pending', getPendingListings);
router.get('/listings/approved', getApprovedListings);
router.patch('/listings/:id/moderate', moderateListing);
router.get('/users/poor-ratings', getPoorRatedUsers);
router.patch('/users/:id/suspend', suspendUser);

// Stats routes
router.get('/listings/stats', getListingStats);
router.get('/users/stats', getUserStats);

export default router;
