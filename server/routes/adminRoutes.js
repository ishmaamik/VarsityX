// routes/adminRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
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
    getUserStats
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorizeRole(['Admin', 'StudentAdmin']));

// Admin-only routes
router.get('/admin-data', getAdminData);
router.post('/manage-users', manageUsers);
router.get('/student-admins', getStudentAdmins);
router.patch('/users/:id/make-student-admin', assignStudentAdmin);
router.patch('/users/:id/remove-student-admin', removeStudentAdmin);

// Routes accessible by both admin and student-admin
router.get('/stats', getDashboardStats);
router.get('/listings/pending', getPendingListings);
router.patch('/listings/:id/moderate', moderateListing);
router.get('/users/poor-ratings', getPoorRatedUsers);
router.patch('/users/:id/suspend', suspendUser);

// Listing routes
router.get('/listings/stats', getListingStats);

// User routes
router.get('/users/stats', getUserStats);

export default router;
