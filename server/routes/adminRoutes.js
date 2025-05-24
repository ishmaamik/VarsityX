// routes/adminRoutes.js
import express from 'express';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { getAdminData, manageUsers } from '../controllers/adminController.js';  // Admin Controller

const router = express.Router();

// Admin-only route for viewing admin data
router.get('/admin-data', authorizeRole(['Admin']), getAdminData);

// Admin route for managing users
router.post('/manage-users', authorizeRole(['Admin']), manageUsers);

export default router;
