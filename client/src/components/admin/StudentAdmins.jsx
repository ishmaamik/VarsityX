import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, UserPlus, UserMinus } from 'lucide-react';

const StudentAdmins = () => {
    const [studentAdmins, setStudentAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudentAdmins();
    }, []);

    const fetchStudentAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/student-admins', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudentAdmins(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching student admins');
            setLoading(false);
        }
    };

    const handleRemoveStudentAdmin = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `/api/admin/users/${userId}/remove-student-admin`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchStudentAdmins();
        } catch (err) {
            setError(err.response?.data?.error || 'Error removing student admin');
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Student Administrators</h2>
                <button
                    onClick={() => {/* Add new student admin logic */}}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Student Admin
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    University
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {studentAdmins?.map((admin) => (
                                <tr key={admin._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={admin.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.displayName)}`}
                                                alt={admin.displayName}
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <div>
                                                <div className="font-medium">{admin.displayName}</div>
                                                <div className="text-sm text-gray-500">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Shield className="w-4 h-4 text-blue-500 mr-2" />
                                            <span>{admin.university.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleRemoveStudentAdmin(admin._id)}
                                            className="flex items-center text-red-600 hover:text-red-900"
                                        >
                                            <UserMinus className="w-4 h-4 mr-1" />
                                            Remove Admin
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAdmins; 