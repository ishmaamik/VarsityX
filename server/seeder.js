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

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Delete existing universities
        await University.deleteMany();
        console.log('Universities cleared');

        // Add new universities
        await University.insertMany(universities);
        console.log('Universities seeded');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 