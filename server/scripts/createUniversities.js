import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University.js';

dotenv.config();

const universities = [
  { _id: 'IUT', name: 'IUT' },
  { _id: 'BUET', name: 'BUET' },
  { _id: 'DU', name: 'DU' },
  { _id: 'BRAC', name: 'BRAC' },
  { _id: 'NSU', name: 'NSU' }
];

const createUniversities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Create universities one by one
    for (const uni of universities) {
      try {
        await University.create(uni);
        console.log(`Created university: ${uni.name}`);
      } catch (error) {
        // Skip if university already exists
        if (error.code === 11000) {
          console.log(`University ${uni.name} already exists`);
        } else {
          console.error(`Error creating university ${uni.name}:`, error);
        }
      }
    }

    console.log('Finished creating universities');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUniversities(); 