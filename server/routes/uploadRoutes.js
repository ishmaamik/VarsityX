import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';

const createUploadRouter = (upload) => {
  const router = express.Router();

  // Handle single file upload with field name 'file'
  router.post('/', upload.single('file'), uploadFile);

  return router;
};

export default createUploadRouter;