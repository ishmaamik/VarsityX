// controllers/adminController.js
import User from '../models/User.js';

// Admin-specific data (for demonstration)
export const getAdminData = async (req, res) => {
  try {
    // Fetch some admin-specific data (e.g., all users, statistics, etc.)
    const users = await User.find();  // Admin can view all users
    res.json({ users });  // Send back the list of users
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin function to manage users (e.g., activating, deactivating users)
export const manageUsers = async (req, res) => {
  try {
    const { userId, action } = req.body; // Example action: 'activate', 'deactivate', etc.
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Example: change user status based on action
    if (action === 'deactivate') {
      user.isActive = false;
    } else if (action === 'activate') {
      user.isActive = true;
    }

    await user.save();  // Save the updated user data
    res.json({ message: `User ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
