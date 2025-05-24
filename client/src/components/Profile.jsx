import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    photo: '',
    university: '',
    program: '',
    yearOfStudy: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        displayName: user.displayName || '',
        email: user.email || '',
        photo: user.photo || '',
        university: user.university || '',
        program: user.program || '',
        yearOfStudy: user.yearOfStudy || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        profile,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Academic Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={profile.photo || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-medium">{profile.displayName}</h3>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Academic Info */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <input
              type="text"
              name="university"
              value={profile.university}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Your university"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            <input
              type="text"
              name="program"
              value={profile.program}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Your program of study"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Study</label>
            <select
              name="yearOfStudy"
              value={profile.yearOfStudy}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Short Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Brief introduction about yourself"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile; 