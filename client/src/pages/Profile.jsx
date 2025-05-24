import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Edit2,
  Camera,
  Shield,
  Star,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  ArrowRight,
  Book,
  Laptop,
  Bike,
  DollarSign,
  ShoppingCart,
  Tag,
  BookOpen,
  Calendar,
  Award,
  Edit,
  Package,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewSystem from '../components/ReviewSystem';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState({
    name: 'Sani Ahmed',
    email: 'sani@iut-dhaka.edu',
    phone: '+880 1234567890',
    university: 'Islamic University of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    joinDate: 'January 2024',
    rating: 4.8,
    totalReviews: 24,
    totalListings: 8,
    totalSales: 12,
    isVerified: true,
    profileImage: 'https://ui-avatars.com/api/?name=Sani+Ahmed&background=0D8ABC&color=fff'
  });

  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Mountain Bike',
      price: 12000,
      category: 'Transport',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 2,
      title: 'Calculus Textbook',
      price: 800,
      category: 'Books',
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D'
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: 'Faiza Rahman',
      rating: 5,
      comment: 'Great seller! The bike was exactly as described.',
      date: '2 days ago'
    },
    {
      id: 2,
      reviewer: 'Rahim Khan',
      rating: 4,
      comment: 'Quick response and smooth transaction.',
      date: '1 week ago'
    }
  ]);

  const stats = [
    { label: 'Active Listings', value: user.totalListings.toString(), icon: <ShoppingBag className="text-blue-500" /> },
    { label: 'Total Sales', value: user.totalSales.toString(), icon: <DollarSign className="text-green-500" /> },
    { label: 'Total Reviews', value: user.totalReviews.toString(), icon: <Star className="text-yellow-500" /> },
    { label: 'Rating', value: user.rating.toString(), icon: <Star className="text-purple-500" /> },
  ];

  const recentActivity = [
    { type: 'sale', item: 'Calculus Textbook', price: '$25', date: '2 days ago' },
    { type: 'purchase', item: 'MacBook Air 2020', price: '$650', date: '5 days ago' },
    { type: 'listing', item: 'Mountain Bike', price: '$120', date: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {user.isVerified && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm flex items-center gap-1">
                    <Shield size={14} />
                    Verified Student
                  </span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <GraduationCap className="w-4 h-4" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <BookOpen className="w-4 h-4" />
                  <span>{user.department} - {user.year}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{user.rating}</span>
                  <span className="text-gray-500">({user.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">{user.totalListings} Listings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{user.totalSales} Sales</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2">
                <Edit2 size={18} />
                Edit Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {['listings', 'reviews', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-purple-500 text-purple-500'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'listings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            activity.type === 'sale' ? 'bg-green-100 dark:bg-green-900' :
                            activity.type === 'purchase' ? 'bg-blue-100 dark:bg-blue-900' :
                            'bg-purple-100 dark:bg-purple-900'
                          }`}>
                            {activity.type === 'sale' ? <DollarSign className="text-green-500" /> :
                             activity.type === 'purchase' ? <ShoppingCart className="text-blue-500" /> :
                             <ShoppingBag className="text-purple-500" />}
                          </div>
                          <div>
                            <div className="font-medium">{activity.item}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</div>
                          </div>
                        </div>
                        <div className="font-semibold">{activity.price}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <ReviewSystem type="seller" sellerId={user._id} />
                  </div>
                )}
                {activeTab === 'settings' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-blue-500" />
                          <div>
                            <h4 className="font-medium">Verification Status</h4>
                            <p className="text-sm text-gray-500">Verified Student</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">View Details</button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="w-5 h-5 text-green-500" />
                          <div>
                            <h4 className="font-medium">Notification Preferences</h4>
                            <p className="text-sm text-gray-500">Manage your notifications</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">Configure</button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-purple-500" />
                          <div>
                            <h4 className="font-medium">Safe Meetup Locations</h4>
                            <p className="text-sm text-gray-500">Manage your preferred meetup spots</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="text-purple-500" />
                    <span>Create New Listing</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-blue-500" />
                    <span>View Messages</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="text-gray-500" />
                    <span>Account Settings</span>
                  </div>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                  <span className="font-medium">{user.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Department</span>
                  <span className="font-medium">{user.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Year</span>
                  <span className="font-medium">{user.year}</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 