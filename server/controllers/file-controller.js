import path from 'path';
import fs from 'fs';

const url = 'http://localhost:5000';

export const uploadFile = (request, response) => {
    if(!request.file) 
        return response.status(404).json("File not found");
    
    const imageUrl = `${request.file.filename}`;
    response.status(200).json(imageUrl);    
}

export const getFile = async (request, response) => {
    try {   
        const filename = request.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return response.status(404).json({ msg: 'File not found' });
        }

        response.sendFile(filePath);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}