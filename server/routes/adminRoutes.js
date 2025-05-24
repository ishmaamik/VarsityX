// routes/adminRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
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
    removeStudentAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only routes
router.get('/admin-data', authorize(['admin']), getAdminData);
router.post('/manage-users', authorize(['admin']), manageUsers);
router.get('/student-admins', authorize(['admin']), getStudentAdmins);
router.patch('/users/:id/make-student-admin', authorize(['admin']), assignStudentAdmin);
router.patch('/users/:id/remove-student-admin', authorize(['admin']), removeStudentAdmin);

// Routes accessible by both admin and student-admin
router.get('/stats', authorize(['admin', 'student-admin']), getDashboardStats);
router.get('/listings/pending', authorize(['admin', 'student-admin']), getPendingListings);
router.patch('/listings/:id/moderate', authorize(['admin', 'student-admin']), moderateListing);
router.get('/users/poor-ratings', authorize(['admin', 'student-admin']), getPoorRatedUsers);
router.patch('/users/:id/suspend', authorize(['admin', 'student-admin']), suspendUser);

export default router;
