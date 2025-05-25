import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    MapPin,
    BookOpen,
    Settings,
    LogOut,
    BarChart2,
    MessageSquare,
    CreditCard,
    Calendar,
    FileText,
    ChevronDown,
    ChevronRight,
    Search,
    Bell,
    User,
    ShoppingBag,
    Shield,
    Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import StudentAdminManagement from './StudentAdminManagement';
import PendingListings from '../components/admin/PendingListings';
import ApprovedListings from '../components/admin/ApprovedListings';

const AdminPanel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [subMenuOpen, setSubMenuOpen] = useState({
        listings: false,
        users: false,
        moderation: false
    });
    const [stats, setStats] = useState({
        totalListings: 0,
        pendingListings: 0,
        totalUsers: 0,
        studentAdmins: 0
    });
    const [pendingListings, setPendingListings] = useState([]);
    const [poorRatedUsers, setPoorRatedUsers] = useState([]);
    const navigate = useNavigate();

    // Configure axios
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch listings stats
                const listingsResponse = await axios.get('/api/admin/listings/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Fetch users stats
                const usersResponse = await axios.get('/api/admin/users/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setStats({
                    totalListings: listingsResponse.data.total || 0,
                    pendingListings: listingsResponse.data.pending || 0,
                    totalUsers: usersResponse.data.total || 0,
                    studentAdmins: usersResponse.data.studentAdmins || 0
                });

                // Fetch pending listings
                const pendingResponse = await axios.get('/api/admin/listings/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingListings(pendingResponse.data.data || []);

                // Fetch users with poor ratings
                const poorRatingsResponse = await axios.get('/api/admin/users/poor-ratings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPoorRatedUsers(poorRatingsResponse.data.data || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleModerateListing = async (listingId, action, reason = '') => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `/api/admin/listings/${listingId}/moderate`,
                { action, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh pending listings
            const response = await axios.get('/api/admin/listings/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingListings(response.data.data || []);
        } catch (error) {
            console.error('Error moderating listing:', error);
        }
    };

    const handleSuspendUser = async (userId, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `/api/admin/users/${userId}/suspend`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh poor rated users list
            const response = await axios.get('/api/admin/users/poor-ratings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPoorRatedUsers(response.data.data || []);
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
            {/* Sidebar */}
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} activeMenu={activeMenu} setActiveMenu={setActiveMenu} subMenuOpen={subMenuOpen} setSubMenuOpen={setSubMenuOpen} />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Top Navigation */}
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold capitalize">{activeMenu.replace('-', ' ')}</h1>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>

                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-2">
                                <div onClick={()=>navigate('/user')} className="w-8 h-8 cursor-pointer rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                </div>
                                {sidebarOpen && <span className="font-medium">Admin</span>}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {activeMenu === "dashboard" && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Listings</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.totalListings}</h3>
                                        </div>
                                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Listings</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.pendingListings}</h3>
                                        </div>
                                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
                                        </div>
                                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                                            <Users className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Student Admins</p>
                                            <h3 className="text-2xl font-bold mt-1">{stats.studentAdmins}</h3>
                                        </div>
                                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Listings */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold">Pending Listings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">University</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {pendingListings.map((listing) => (
                                                <tr key={listing._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{listing.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{listing.seller.displayName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{listing.university.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">৳{listing.price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handleModerateListing(listing._id, 'approve')}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Enter rejection reason:');
                                                                if (reason) {
                                                                    handleModerateListing(listing._id, 'reject', reason);
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Users with Poor Ratings */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold">Users with Poor Ratings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">University</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Reviews</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {poorRatedUsers.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                                                                alt={user.displayName}
                                                                className="w-8 h-8 rounded-full mr-3"
                                                            />
                                                            <div>
                                                                <div className="font-medium">{user.displayName}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.university.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                            <span>{user.averageRating.toFixed(1)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.totalRatings}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Enter suspension reason:');
                                                                if (reason) {
                                                                    handleSuspendUser(user._id, reason);
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Suspend User
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeMenu === "listings-pending" && (
                        <div className="p-6">
                            <PendingListings />
                        </div>
                    )}

                    {activeMenu === "listings-approved" && (
                        <div className="p-6">
                            <ApprovedListings />
                        </div>
                    )}

                    {activeMenu === "trips-all" && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">All Trips</h2>
                            {/* Trip management content would go here */}
                        </div>
                    )}

                    {activeMenu === "users-all" && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">All Users</h2>
                            {/* User management content would go here */}
                        </div>
                    )}

                    {activeMenu === "content-destinations" && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">Destinations</h2>
                            {/* Destination management content would go here */}
                        </div>
                    )}

                    {activeMenu === "users-student-admins" && (
                        <StudentAdminManagement />
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;