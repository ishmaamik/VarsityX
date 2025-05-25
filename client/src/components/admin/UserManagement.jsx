import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Ban, 
  CheckCircle, 
  XCircle,
  Eye,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const universities = ['IUT', 'BUET', 'DU', 'BRAC', 'NSU'];

  useEffect(() => {
    fetchUsers();
  }, [selectedUniversity]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = selectedUniversity ? 
        `${API_BASE}/admin/users/university/${selectedUniversity}` :
        `${API_BASE}/admin/users`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${API_BASE}/admin/users/${userId}/${isBanned ? 'unban' : 'ban'}`;
      
      await axios.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`User ${isBanned ? 'unbanned' : 'banned'} successfully`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast.error('Failed to update user ban status');
    }
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">All Universities</option>
          {universities.map((uni) => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user._id} className={user.isBanned ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.displayName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{user.university}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.role === 'Admin' ? (
                      <Shield className="w-4 h-4 text-indigo-500 mr-2" />
                    ) : user.role === 'StudentAdmin' ? (
                      <GraduationCap className="w-4 h-4 text-blue-500 mr-2" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                    )}
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isBanned
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  }`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/student-profile/${user._id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleBanUser(user._id, user.isBanned)}
                      className={`${
                        user.isBanned
                          ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      }`}
                    >
                      {user.isBanned ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Ban className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 