import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Book, 
  GraduationCap, 
  Clock, 
  Eye, 
  EyeOff,
  Phone,
  Calendar as BirthDate,
  Hash,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const StudentProfile = () => {
  const { userId } = useParams(); // Get userId from URL if viewing someone else's profile
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const isOwnProfile = !userId || userId === currentUser?._id;
  const isAdmin = currentUser?.role === 'Admin';
  const [formData, setFormData] = useState({
    department: '',
    program: '',
    yearOfStudy: '',
    bio: '',
    isProfilePublic: true,
    showDepartment: true,
    showProgram: true,
    showYearOfStudy: true,
    privateInfo: {
      phoneNumber: '',
      dateOfBirth: '',
      studentId: ''
    }
  });

  // Predefined options for dropdowns
  const departments = [
    'Computer Science & Engineering',
    'Electrical & Electronic Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Industrial & Production Engineering',
    'Business Administration',
    'Architecture',
    'Other'
  ];

  const programs = [
    'BSc',
    'BBA',
    'B.Arch',
    'MSc',
    'MBA',
    'M.Arch',
    'PhD'
  ];

  const yearOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // If viewing own profile or admin viewing any profile
      const endpoint = isOwnProfile ? 
        `${API_BASE}/student-profile/me` : 
        `${API_BASE}/student-profile/${userId}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data.data;
      setProfile(profileData);
      
      // Only set form data if it's own profile
      if (isOwnProfile) {
        setFormData({
          department: profileData.department || '',
          program: profileData.program || '',
          yearOfStudy: profileData.yearOfStudy || '',
          bio: profileData.bio || '',
          isProfilePublic: profileData.isProfilePublic,
          showDepartment: profileData.showDepartment,
          showProgram: profileData.showProgram,
          showYearOfStudy: profileData.showYearOfStudy,
          privateInfo: {
            phoneNumber: profileData.privateInfo?.phoneNumber || '',
            dateOfBirth: profileData.privateInfo?.dateOfBirth ? new Date(profileData.privateInfo.dateOfBirth).toISOString().split('T')[0] : '',
            studentId: profileData.privateInfo?.studentId || ''
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/student-profile/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('privateInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        privateInfo: {
          ...prev.privateInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (!profile) {
    return <div className="text-center py-20 text-lg">Loading profile information...</div>;
  }

  const canViewPrivateInfo = isOwnProfile || isAdmin;
  const canEdit = isOwnProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 text-gray-900 dark:text-white transition-colors duration-500 ease-in-out">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6"
        >
          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <img
                    src={profile.user?.photo || 'https://i.pravatar.cc/150?img=68'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-400"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">{profile.user?.displayName}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{profile.user?.email}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <MapPin size={16} className="mr-2 text-indigo-500" />
                      {profile.university || 'University not set'}
                      {isAdmin && (
                        <Shield size={16} className="ml-4 mr-2 text-indigo-500" />
                      )}
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-full text-white flex items-center"
                  >
                    <Edit3 size={16} className="mr-2" /> Edit Profile
                  </button>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Academic Information</h3>
                  {profile.isProfilePublic ? (
                    <>
                      {profile.showDepartment && (
                        <div className="flex items-center">
                          <Book size={18} className="mr-2 text-indigo-500" />
                          Department: {profile.department || 'Not specified'}
                        </div>
                      )}
                      {profile.showProgram && (
                        <div className="flex items-center">
                          <GraduationCap size={18} className="mr-2 text-indigo-500" />
                          Program: {profile.program || 'Not specified'}
                        </div>
                      )}
                      {profile.showYearOfStudy && (
                        <div className="flex items-center">
                          <Clock size={18} className="mr-2 text-indigo-500" />
                          Year of Study: {profile.yearOfStudy || 'Not specified'}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">Profile is private</p>
                  )}
                </div>

                {canViewPrivateInfo && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Private Information</h3>
                    <div className="flex items-center">
                      <Phone size={18} className="mr-2 text-indigo-500" />
                      Phone: {profile.privateInfo?.phoneNumber || 'Not provided'}
                    </div>
                    <div className="flex items-center">
                      <BirthDate size={18} className="mr-2 text-indigo-500" />
                      Birth Date: {profile.privateInfo?.dateOfBirth ? new Date(profile.privateInfo.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </div>
                    <div className="flex items-center">
                      <Hash size={18} className="mr-2 text-indigo-500" />
                      Student ID: {profile.privateInfo?.studentId || 'Not provided'}
                    </div>
                  </div>
                )}
              </div>

              {(profile.isProfilePublic || canViewPrivateInfo) && profile.bio && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Bio</h3>
                  <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Academic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">University</label>
                    <input
                      type="text"
                      value={profile.user?.university || 'Not Set'}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">University is set in your main profile</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Program</label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                    >
                      <option value="">Select Program</option>
                      {programs.map((prog) => (
                        <option key={prog} value={prog}>{prog}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Year of Study</label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>Year {year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Private Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="privateInfo.phoneNumber"
                      value={formData.privateInfo.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="privateInfo.dateOfBirth"
                      value={formData.privateInfo.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <input
                      type="text"
                      name="privateInfo.studentId"
                      value={formData.privateInfo.studentId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-800"
                      placeholder="Enter your student ID"
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <h4 className="font-medium">Privacy Settings</h4>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isProfilePublic"
                        checked={formData.isProfilePublic}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span>Make profile public</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showDepartment"
                        checked={formData.showDepartment}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span>Show department</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showProgram"
                        checked={formData.showProgram}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span>Show program</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="showYearOfStudy"
                        checked={formData.showYearOfStudy}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span>Show year of study</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile; 