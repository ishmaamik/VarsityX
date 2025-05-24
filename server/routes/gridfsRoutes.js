import express from 'express';
import { initializeStorage } from '../config/gridfs.js';
import { uploadImage, getImage, deleteImage } from '../controllers/gridfs-controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get image route (public)
router.get('/:filename', getImage);

// Protected routes
router.use(protect);

// Upload route - initialize storage for each request
router.post('/upload', (req, res, next) => {
    try {
        const upload = initializeStorage();
        if (!upload) {
            return res.status(500).json({
                success: false,
                message: "Storage not initialized"
            });
        }

        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message || "Error uploading file"
                });
            }
            next();
        });
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}, uploadImage);

// Delete image route (protected)
router.delete('/:filename', deleteImage);

export default router; 