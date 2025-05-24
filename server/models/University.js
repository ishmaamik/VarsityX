import mongoose from 'mongoose';

const UniversitySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a university name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('University', UniversitySchema); 