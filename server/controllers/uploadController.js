// uploadController.js - Fixed version
export const uploadFile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
  
      // Check if file was actually uploaded to GridFS
      if (!req.file.id) {
        return res.status(500).json({
          success: false,
          message: 'File upload to GridFS failed'
        });
      }
  
      const uploadedFile = {
        id: req.file.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        contentType: req.file.contentType || req.file.mimetype,
        url: `/file/${req.file.filename}`
      };
  
      res.status(201).json({
        success: true,
        file: uploadedFile
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: err.message
      });
    }
  };
  
  export const getFile = async (req, res) => {
    try {
      const gfs = req.app.locals.gfs;
      
      if (!gfs) {
        return res.status(500).json({
          success: false,
          message: 'GridFS not initialized'
        });
      }
  
      const files = await gfs.find({ filename: req.params.filename }).toArray();
  
      if (!files || files.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
  
      res.set('Content-Type', files[0].contentType || 'application/octet-stream');
  
      const readStream = gfs.openDownloadStreamByName(req.params.filename);
      
      readStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error streaming file',
            error: error.message
          });
        }
      });
      
      readStream.pipe(res);
    } catch (err) {
      console.error('Get file error:', err);
      res.status(500).json({
        success: false,
        message: 'Error retrieving file',
        error: err.message
      });
    }
  };