import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const universities = ['IUT', 'BUET', 'DU', 'BRAC', 'NSU'];
  const [selectedUniversity, setSelectedUniversity] = useState(user?.university || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.university) {
      setSelectedUniversity(user.university);
    }
  }, [user]);

  const handleUpdateUniversity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/update-university',
        { university: selectedUniversity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUser(response.data.data);
        navigate('/marketplace');
      }
    } catch (err) {
      console.error('Error updating university:', err);
      setError(err.response?.data?.message || 'Failed to update university');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateUniversity}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              University
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedUniversity}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Update University'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 