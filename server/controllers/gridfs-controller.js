import { gfs } from '../config/gridfs.js';
import mongoose from 'mongoose';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        return res.status(200).json({
            success: true,
            file: req.file.filename
        });
    } catch (error) {
        console.error('File upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error uploading file"
        });
    }
};

export const getImage = async (req, res) => {
    try {
        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        console.error('File retrieval error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error retrieving file"
        });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        await gfs.delete(new mongoose.Types.ObjectId(file[0]._id));
        
        return res.status(200).json({
            success: true,
            message: "File deleted successfully"
        });
    } catch (error) {
        console.error('File deletion error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting file"
        });
    }
}; 