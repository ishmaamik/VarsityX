import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, Bell, User, Book, Laptop, Bike, MessageSquare,
  GraduationCap, ArrowRight, ShoppingCart, Moon, Sun, Loader
} from 'lucide-react';
import axios from 'axios';

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured listings
  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/marketplace', {
          params: { limit: 3, sortBy: 'newest' }
        });
        setFeaturedListings(response.data.listings);
      } catch (err) {
        console.error('Error fetching featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedListings();
  }, []);

  // Load cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartItems(response.data.cart);
        } else {
          const savedCart = localStorage.getItem('cartItems');
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, []);

  const categories = [
    { name: 'Textbooks', icon: <Book size={20} />, id: 'textbooks' },
    { name: 'Electronics', icon: <Laptop size={20} />, id: 'electronics' },
    { name: 'Transport', icon: <Bike size={20} />, id: 'transport' },
    { name: 'Tutoring', icon: <GraduationCap size={20} />, id: 'tutoring' },
    { name: 'Skill Exchange', icon: <MessageSquare size={20} />, id: 'skill-exchange' },
  ];

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/cart', 
          { listingId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update local state
        setCartItems(prev => {
          const existing = prev.find(item => item.listing._id === product._id);
          if (existing) {
            return prev.map(item => 
              item.listing._id === product._id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
          }
          return [...prev, { listing: product, quantity: 1 }];
        });
      } else {
        // For guest users
        const updated = [...cartItems];
        const existing = updated.find(item => item._id === product._id);
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push({ ...product, quantity: 1 });
        }
        setCartItems(updated);
        localStorage.setItem('cartItems', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const filteredListings = featuredListings.filter(listing => 
    (selectedCategory === 'all' || listing.category === selectedCategory) &&
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">CampusSwap</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </button>
              
              <button 
                onClick={() => navigate('/marketplace/cart')}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
              
              <div className="cursor-pointer w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User onClick={() => navigate("/profile")} size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Student Marketplace 🎓</h1>
          <p className="text-gray-600 dark:text-gray-300">Buy, sell, and exchange with fellow students</p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col items-center cursor-pointer hover:shadow-md transition-all ${
                  selectedCategory === category.id ? 'border-2 border-blue-500' : ''
                }`}
              >
                <div className="mb-2 text-blue-500 dark:text-blue-400">
                  {category.icon}
                </div>
                <h3 className="font-medium dark:text-white">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">Featured Listings</h2>
            <button 
              onClick={() => navigate("/marketplace/buy")}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              View all <ArrowRight className="ml-1" size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div 
                key={listing._id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {listing.images?.[0] ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <Image size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 dark:text-white">{listing.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      ৳{listing.price || listing.hourlyRate || listing.currentBid}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{listing.university}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(listing)}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">How CampusSwap Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-300">Verify with your university email to join the community</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Browse or List Items</h3>
              <p className="text-gray-600 dark:text-gray-300">Find what you need or sell what you don't</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Connect & Transact</h3>
              <p className="text-gray-600 dark:text-gray-300">Message sellers and arrange secure transactions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceHome;