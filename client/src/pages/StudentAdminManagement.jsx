import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, User, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentAdminManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [users, setUsers] = useState([]);
  const [studentAdmins, setStudentAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      fetchUniversityUsers();
      fetchStudentAdmins();
    }
  }, [selectedUniversity]);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast.error('Failed to fetch universities');
    }
  };

  const fetchUniversityUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/university/${selectedUniversity}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching university users:', error);
      toast.error('Failed to fetch university users');
    }
  };

  const fetchStudentAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/student-admin/university/${selectedUniversity}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudentAdmins(response.data.data);
    } catch (error) {
      console.error('Error fetching student admins:', error);
      toast.error('Failed to fetch student admins');
    }
  };

  const assignStudentAdmin = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/student-admin/assign',
        {
          userId,
          universityId: selectedUniversity
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Student admin assigned successfully');
      fetchStudentAdmins();
      fetchUniversityUsers();
    } catch (error) {
      console.error('Error assigning student admin:', error);
      toast.error(error.response?.data?.message || 'Failed to assign student admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Student Admin Management</h2>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select University</option>
          {universities?.map((university) => (
            <option key={university._id} value={university._id}>
              {university.name}
            </option>
          ))}
        </select>
      </div>

      {selectedUniversity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Student Admins */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Current Student Admins</h3>
            <div className="space-y-4">
              {studentAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium">{admin.user.displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{admin.user.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Approved: {admin.moderationStats.listingsApproved}</p>
                    <p>Rejected: {admin.moderationStats.listingsRejected}</p>
                  </div>
                </div>
              ))}
              {studentAdmins.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No student admins assigned yet</p>
              )}
            </div>
          </div>

          {/* Eligible Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Eligible Users</h3>
            <div className="space-y-4">
              {users
                .filter(user => !studentAdmins.find(admin => admin.user._id === user._id))
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => assignStudentAdmin(user._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
                    >
                      Assign as Admin
                    </button>
                  </div>
                ))}
              {users.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No eligible users found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAdminManagement; 