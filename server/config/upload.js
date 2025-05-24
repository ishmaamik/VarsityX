import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export function createUpload(mongoUri) {
  if (!mongoUri) throw new Error('Mongo URI is required');

  const storage = new GridFsStorage({
    url: mongoUri,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = `${uuidv4()}${path.extname(file.originalname)}`;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            originalName: file.originalname,
            uploadedBy: req.user?.userId || 'anonymous',
            uploadDate: new Date(),
          }
        };
        resolve(fileInfo);
      });
    }
  });

  const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Images only!'));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}