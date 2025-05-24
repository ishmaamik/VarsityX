import express from 'express';
import { uploadFile, getFile } from "../controllers/file-controller.js";
import upload from "../config/upload.js";
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Protected routes
router.use(protect);

// File upload route with error handling
router.post('/file/upload', 
    (req, res, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    },
    uploadFile
);

// Public route for file retrieval
router.get('/file/:filename', getFile);

export default router;
