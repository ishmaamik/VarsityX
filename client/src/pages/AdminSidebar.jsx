import React from "react";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    BarChart2,
    MessageSquare,
    Shield,
    AlertTriangle,
    Star,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/Mode";

const AdminSidebar = ({open, setOpen, activeMenu, setActiveMenu, subMenuOpen, setSubMenuOpen}) => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const toggleSubMenu = (menu) => {
        setSubMenuOpen(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return (
        <div className={`${open ? "w-64" : "w-20"} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col h-screen`}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                {open ? (
                    <h1 className="text-xl font-bold text-blue-600">VarsityX Admin</h1>
                ) : (
                    <h1 className="text-xl font-bold text-blue-600">VX</h1>
                )}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {open ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => [setActiveMenu("dashboard"), navigate("/admin")]}
                                className={`flex items-center w-full p-3 rounded-lg ${activeMenu === "dashboard" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                {open && <span className="ml-3">Dashboard</span>}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => toggleSubMenu("listings")}
                                className={`flex items-center justify-between w-full p-3 rounded-lg ${activeMenu.startsWith("listings") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <div className="flex items-center">
                                    <ShoppingBag className="w-5 h-5" />
                                    {open && <span className="ml-3">Listings</span>}
                                </div>
                                {open && (subMenuOpen.listings ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>

                            {subMenuOpen.listings && open && (
                                <ul className="ml-8 mt-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("listings-pending")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "listings-pending" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Pending Approval
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("listings-approved")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "listings-approved" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Approved
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("listings-rejected")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "listings-rejected" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Rejected
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => toggleSubMenu("users")}
                                className={`flex items-center justify-between w-full p-3 rounded-lg ${activeMenu.startsWith("users") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <div className="flex items-center">
                                    <Users className="w-5 h-5" />
                                    {open && <span className="ml-3">Users</span>}
                                </div>
                                {open && (subMenuOpen.users ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>

                            {subMenuOpen.users && open && (
                                <ul className="ml-8 mt-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("users-all")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "users-all" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            All Users
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("users-student-admins")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "users-student-admins" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Student Admins
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("users-suspended")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "users-suspended" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Suspended Users
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => toggleSubMenu("moderation")}
                                className={`flex items-center justify-between w-full p-3 rounded-lg ${activeMenu.startsWith("moderation") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5" />
                                    {open && <span className="ml-3">Moderation</span>}
                                </div>
                                {open && (subMenuOpen.moderation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>

                            {subMenuOpen.moderation && open && (
                                <ul className="ml-8 mt-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("moderation-reports")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "moderation-reports" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Reports
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setActiveMenu("moderation-poor-ratings")}
                                            className={`w-full text-left p-2 rounded-lg ${activeMenu === "moderation-poor-ratings" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Poor Ratings
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => setActiveMenu("analytics")}
                                className={`flex items-center w-full p-3 rounded-lg ${activeMenu === "analytics" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <BarChart2 className="w-5 h-5" />
                                {open && <span className="ml-3">Analytics</span>}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActiveMenu("messages")}
                                className={`flex items-center w-full p-3 rounded-lg ${activeMenu === "messages" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <MessageSquare className="w-5 h-5" />
                                {open && <span className="ml-3">Messages</span>}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActiveMenu("settings")}
                                className={`flex items-center w-full p-3 rounded-lg ${activeMenu === "settings" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                            >
                                <Settings className="w-5 h-5" />
                                {open && <span className="ml-3">Settings</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <DarkModeToggle />
                <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogOut className="w-5 h-5" />
                    {open && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;