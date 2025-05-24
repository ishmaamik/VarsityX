import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Book,
  Laptop,
  Bike,
  Search,
  User,
  MessageSquare,
  Shield,
  MapPin,
  CreditCard,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Active Students', value: '5K+', icon: <GraduationCap className="text-blue-500" /> },
    { label: 'Items Listed', value: '2K+', icon: <Book className="text-green-500" /> },
    { label: 'Services Offered', value: '500+', icon: <MessageSquare className="text-purple-500" /> },
    { label: 'Successful Transactions', value: '3K+', icon: <Shield className="text-orange-500" /> },
  ];

  const categories = [
    { name: 'Textbooks', icon: <Book size={24} /> },
    { name: 'Electronics', icon: <Laptop size={24} /> },
    { name: 'Transport', icon: <Bike size={24} /> },
    { name: 'Services', icon: <MessageSquare size={24} /> },
  ];

  const recentListings = [
    { title: 'Calculus Textbook', price: '$25', university: 'IUT', time: '2 hours ago' },
    { title: 'MacBook Air 2020', price: '$650', university: 'DU', time: '5 hours ago' },
    { title: 'Mountain Bike', price: '$120', university: 'BUET', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">VarsityX</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items or services..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>
              <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </button>
              <div className="cursor-pointer w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User onClick={() => navigate("/profile")} size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to VarsityX! 🎓
          </h1>
          <p className="text-gray-600 dark:text-gray-300">The trusted marketplace for students to buy, sell, and connect</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex items-start">
              <div className="mr-4">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Student-Exclusive Marketplace</h2>
          <p className="text-lg mb-6">Verified students. Safe transactions. Campus convenience.</p>
          <button 
            onClick={() => navigate("/create-listing")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <span>List an Item</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              >
                <div className="mb-2">
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <GraduationCap className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student Verification</h3>
            <p className="text-gray-600 dark:text-gray-300">Only verified students from participating universities can join</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <MapPin className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safe Campus Meetups</h3>
            <p className="text-gray-600 dark:text-gray-300">Arrange exchanges at verified campus locations</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <CreditCard className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600 dark:text-gray-300">Optional integrated payment system for safe transactions</p>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
          <div className="space-y-3">
            {recentListings.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => navigate("/listing/123")}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  {index === 0 ? <Book className="w-5 h-5 text-blue-600 dark:text-blue-300" /> : 
                   index === 1 ? <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-300" /> : 
                   <Bike className="w-5 h-5 text-blue-600 dark:text-blue-300" />}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="font-bold">{item.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{item.university}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate("/listings")}
            className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center"
          >
            View all listings <ArrowRight className="ml-1" size={18} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;