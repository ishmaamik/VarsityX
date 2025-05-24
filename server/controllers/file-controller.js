import path from 'path';
import fs from 'fs';

const url = process.env.SERVER_URL || 'http://localhost:5000';

export const uploadFile = (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Check if file was actually saved
        const filePath = path.join(process.cwd(), 'uploads', request.file.filename);
        if (!fs.existsSync(filePath)) {
            return response.status(500).json({
                success: false,
                message: "File upload failed"
            });
        }

        const imageUrl = `${url}/upload/file/${request.file.filename}`;
        
        response.status(200).json({
            success: true,
            filename: request.file.filename,
            url: imageUrl
        });
    } catch (error) {
        console.error('File upload error:', error);
        response.status(500).json({
            success: false,
            message: error.message || "Error uploading file"
        });
    }
};

export const getFile = async (request, response) => {
    try {   
        const filename = request.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return response.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        response.sendFile(filePath);
    } catch (error) {
        console.error('File retrieval error:', error);
        response.status(500).json({
            success: false,
            message: error.message || "Error retrieving file"
        });
    }
};