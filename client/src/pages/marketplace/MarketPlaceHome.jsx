import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, Bell, User, Book, Laptop, Bike, MessageSquare,
  GraduationCap, ArrowRight, ShoppingCart, Moon, Sun
} from 'lucide-react';

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const categories = [
    { name: 'Textbooks', icon: <Book size={20} />, id: 'textbooks' },
    { name: 'Electronics', icon: <Laptop size={20} />, id: 'electronics' },
    { name: 'Transport', icon: <Bike size={20} />, id: 'transport' },
    { name: 'Tutoring', icon: <GraduationCap size={20} />, id: 'tutoring' },
    { name: 'Skill Exchange', icon: <MessageSquare size={20} />, id: 'skill-exchange' },
  ];

  const featuredListings = [
    { 
      id: 1, 
      title: 'Calculus Textbook', 
      price: 25, 
      category: 'textbooks',
      university: 'IUT',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    // ... other listings
  ];

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const filteredListings = featuredListings.filter(listing => 
    (selectedCategory === 'all' || listing.category === selectedCategory) &&
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                key={listing.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 dark:text-white">{listing.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">৳{listing.price}</span>
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
            {/* ... other steps */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceHome;