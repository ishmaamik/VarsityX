import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, Filter, ChevronDown, Book, Laptop, Bike, 
  GraduationCap, MessageSquare, ShoppingCart, Moon, Sun
} from 'lucide-react';

const BuyPage = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('textbooks');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const categories = [
    { id: 'textbooks', name: 'Textbooks', icon: <Book size={18} /> },
    { id: 'electronics', name: 'Electronics', icon: <Laptop size={18} /> },
    { id: 'transport', name: 'Transport', icon: <Bike size={18} /> },
    { id: 'tutoring', name: 'Tutoring', icon: <GraduationCap size={18} /> },
    { id: 'skill-exchange', name: 'Skill Exchange', icon: <MessageSquare size={18} /> },
  ];

  // Sample listings data
  const listings = {
    textbooks: [
      { id: 1, title: 'Calculus Textbook', price: 25, condition: 'Like New', university: 'IUT', image: 'textbook1.jpg' },
      // ... other items
    ],
    // ... other categories
  };

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

  const filteredListings = listings[activeTab]
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with cart and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Buy from Students</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => navigate('/marketplace/cart')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 relative"
            >
              <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative mb-4 md:mb-0 md:mr-4 flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto mb-6 pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                activeTab === category.id 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(item => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 dark:text-white">{item.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">৳{item.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.university}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {item.condition || item.subject}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No listings found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;