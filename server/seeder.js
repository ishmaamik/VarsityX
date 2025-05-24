import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from './models/University.js';

dotenv.config();

const universities = [
    { name: 'IUT' },
    { name: 'BUET' },
    { name: 'DU' },
    { name: 'BRAC' },
    { name: 'NSU' }
];

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const importData = async () => {
    try {
        await University.deleteMany();
        await University.insertMany(universities);
        console.log('Universities imported successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing universities:', error);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await University.deleteMany();
        console.log('Universities deleted successfully');
        process.exit();
    } catch (error) {
        console.error('Error deleting universities:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} 