import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';

let storage;
let upload;
let gfs;

const initializeStorage = () => {
    if (!storage) {
        // Create storage engine
        storage = new GridFsStorage({
            url: process.env.MONGO_URI,
            options: { useNewUrlParser: true, useUnifiedTopology: true },
            file: (req, file) => {
                const match = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

                if (match.indexOf(file.mimetype) === -1) {
                    return {
                        filename: `${Date.now()}-${file.originalname}`,
                        bucketName: 'photos'
                    };
                }

                return {
                    filename: `${Date.now()}-${file.originalname}`,
                    bucketName: 'photos'
                };
            }
        });

        // Initialize multer upload
        upload = multer({ 
            storage,
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB limit
            }
        });
    }
    return upload;
};

// Initialize gfs after MongoDB connection is ready
mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'photos'
    });
    console.log('GridFS initialized');
});

export { initializeStorage, gfs }; 