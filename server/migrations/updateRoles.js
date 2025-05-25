import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Update all users with old role name
    const result = await User.updateMany(
      { role: 'student-admin' },
      { $set: { role: 'StudentAdmin' } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating roles:', error);
    process.exit(1);
  }
};

updateRoles(); 