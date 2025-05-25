import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

// Get student profile (public or private based on access)
export const getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUser = req.user;

    const profile = await StudentProfile.findOne({ user: userId })
      .populate('user', 'displayName email photo');

    if (!profile) {
      // Create a new profile if it doesn't exist
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const newProfile = new StudentProfile({
        user: userId,
        university: user.university || 'Not Set'
      });

      await newProfile.save();

      return res.json({
        success: true,
        data: newProfile
      });
    }

    // If requesting user is admin or profile owner, return full profile
    if (requestingUser.role === 'Admin' || requestingUser.userId === userId) {
      return res.json({
        success: true,
        data: profile
      });
    }

    // If profile is not public, return limited info
    if (!profile.isProfilePublic) {
      return res.json({
        success: true,
        data: {
          user: profile.user,
          university: profile.university,
          isProfilePublic: false
        }
      });
    }

    // Return public info based on privacy settings
    const publicProfile = {
      user: profile.user,
      university: profile.university,
      bio: profile.bio,
      department: profile.showDepartment ? profile.department : undefined,
      program: profile.showProgram ? profile.program : undefined,
      yearOfStudy: profile.showYearOfStudy ? profile.yearOfStudy : undefined,
      isProfilePublic: true
    };

    res.json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile'
    });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      department,
      program,
      yearOfStudy,
      bio,
      isProfilePublic,
      showDepartment,
      showProgram,
      showYearOfStudy,
      privateInfo
    } = req.body;

    let profile = await StudentProfile.findOne({ user: userId });

    if (!profile) {
      // Create new profile if it doesn't exist
      const user = await User.findById(userId);
      profile = new StudentProfile({
        user: userId,
        university: user.university || 'Not Set'
      });
    }

    // Update public fields
    if (department !== undefined) profile.department = department;
    if (program !== undefined) profile.program = program;
    if (yearOfStudy !== undefined) profile.yearOfStudy = yearOfStudy;
    if (bio !== undefined) profile.bio = bio;

    // Update privacy settings
    if (isProfilePublic !== undefined) profile.isProfilePublic = isProfilePublic;
    if (showDepartment !== undefined) profile.showDepartment = showDepartment;
    if (showProgram !== undefined) profile.showProgram = showProgram;
    if (showYearOfStudy !== undefined) profile.showYearOfStudy = showYearOfStudy;

    // Update private info if provided
    if (privateInfo) {
      profile.privateInfo = {
        ...profile.privateInfo,
        ...privateInfo
      };
    }

    await profile.save();

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student profile'
    });
  }
};

// Get own profile
export const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user first to ensure we have university info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Use findOneAndUpdate with upsert to atomically find or create the profile
    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      { 
        $setOnInsert: {
          university: user.university || 'Not Set',
          createdAt: new Date()
        }
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run model validators
      }
    ).populate('user', 'displayName email photo');

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching own profile:', error);
    
    // Handle specific duplicate key error
    if (error.code === 11000) {
      // If we hit a race condition, try one more time to just fetch the profile
      try {
        const profile = await StudentProfile.findOne({ user: req.user.userId })
          .populate('user', 'displayName email photo');
        
        return res.json({
          success: true,
          data: profile
        });
      } catch (retryError) {
        console.error('Error in retry fetch:', retryError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching own profile'
    });
  }
}; 