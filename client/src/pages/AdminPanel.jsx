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
    Star,
    Ban,
    Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import StudentAdmins from '../components/admin/StudentAdmins';
import PendingListings from '../components/admin/PendingListings';
import ApprovedListings from '../components/admin/ApprovedListings';
import UserManagement from '../components/admin/UserManagement';
import { toast } from 'react-hot-toast';

const API_BASE = 'http://localhost:5000';

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
        studentAdmins: 0,
        bannedUsers: 0
    });
    const [pendingListings, setPendingListings] = useState([]);
    const [poorRatedUsers, setPoorRatedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_BASE}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Failed to fetch admin statistics');
            }
        }
    };

    const handleModerateListing = async (listingId, action, reason = '') => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_BASE}/admin/listings/${listingId}/moderate`,
                { action, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh pending listings
            const response = await axios.get(`${API_BASE}/admin/listings/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingListings(response.data.data || []);
        } catch (error) {
            console.error('Error moderating listing:', error);
            toast.error('Failed to moderate listing');
        }
    };

    const handleSuspendUser = async (userId, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_BASE}/admin/users/${userId}/suspend`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh poor rated users list
            const response = await axios.get(`${API_BASE}/admin/users/poor-ratings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPoorRatedUsers(response.data.data || []);
        } catch (error) {
            console.error('Error suspending user:', error);
            toast.error('Failed to suspend user');
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "dashboard":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Total Users</p>
                                        <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Student Admins</p>
                                        <h3 className="text-2xl font-bold">{stats.studentAdmins}</h3>
                                    </div>
                                    <Shield className="w-8 h-8 text-indigo-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Banned Users</p>
                                        <h3 className="text-2xl font-bold">{stats.bannedUsers}</h3>
                                    </div>
                                    <Ban className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Total Listings</p>
                                        <h3 className="text-2xl font-bold">{stats.totalListings}</h3>
                                    </div>
                                    <ShoppingBag className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Pending Listings</p>
                                        <h3 className="text-2xl font-bold">{stats.pendingListings}</h3>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "users-all":
                return <UserManagement />;
            case "users-student-admins":
                return <StudentAdmins />;
            case "listings-pending":
                return <PendingListings />;
            case "listings-approved":
                return <ApprovedListings />;
            case "analytics":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                        <p>Analytics dashboard coming soon...</p>
                    </div>
                );
            case "messages":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Messages</h2>
                        <p>Message center coming soon...</p>
                    </div>
                );
            case "moderation-reports":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Reports</h2>
                        <p>Reports dashboard coming soon...</p>
                    </div>
                );
            case "moderation-poor-ratings":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Poor Ratings</h2>
                        <p>Poor ratings management coming soon...</p>
                    </div>
                );
            case "listings-rejected":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Rejected Listings</h2>
                        <p>Rejected listings management coming soon...</p>
                    </div>
                );
            case "users-suspended":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Suspended Users</h2>
                        <p>Suspended users management coming soon...</p>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                                Welcome to Admin Dashboard
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-500">
                                Select a menu item from the sidebar to get started
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <AdminSidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                subMenuOpen={subMenuOpen}
                setSubMenuOpen={setSubMenuOpen}
            />
            <div className="flex-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;