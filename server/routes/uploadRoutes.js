import express from 'express';
import upload from '../config/upload.js';

const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return uploaded file info (URL, filename etc.)
  // You might want to return the URL where the file can be accessed
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default uploadRouter;
