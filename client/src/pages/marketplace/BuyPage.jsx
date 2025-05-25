import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, Book, Laptop, Bike, 
  GraduationCap, MessageSquare, ShoppingCart, Moon, Sun, Loader 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const universities = ['All Universities', 'IUT', 'DU', 'BUET', 'NSU', 'BRAC'];
const conditions = ['Condition', 'New', 'Like New', 'Good', 'Fair'];

const categories = [
  { id: 'textbooks', name: 'Textbooks', icon: <Book size={18} /> },
  { id: 'electronics', name: 'Electronics', icon: <Laptop size={18} /> },
  { id: 'transport', name: 'Transport', icon: <Bike size={18} /> },
  { id: 'tutoring', name: 'Tutoring', icon: <GraduationCap size={18} /> },
  { id: 'skill-exchange', name: 'Skill Exchange', icon: <MessageSquare size={18} /> },
];

const BuyPage = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterUniversity, setFilterUniversity] = useState('University');
  const [filterCondition, setFilterCondition] = useState('Condition');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get('http://localhost:5000/marketplace', {
          headers,
          params: {
            search: searchTerm,
            category: activeCategory === 'all' ? null : activeCategory,
            university: filterUniversity === 'University' ? null : filterUniversity,
            condition: filterCondition === 'Condition' ? null : filterCondition,
            minPrice: filterPriceMin || null,
            maxPrice: filterPriceMax || null,
            sortBy,
            includeOwn: false // Exclude user's own listings
          }
        });
        setListings(response.data.listings);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeCategory, filterUniversity, filterCondition, filterPriceMin, filterPriceMax, sortBy]);

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

  // Add to cart logic
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Add to cart on server
        const response = await axios.post('http://localhost:5000/cart', 
          { listingId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update cart items from server response
        setCartItems(response.data.cart);
      } else {
        // For guest users
        const updated = [...cartItems];
        const existing = updated.find(item => item.listing?._id === product._id);
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push({ listing: product, quantity: 1 });
        }
        setCartItems(updated);
        localStorage.setItem('cartItems', JSON.stringify(updated));
      }

      // Show success message
      alert('Item added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Browse Marketplace</h1>
          <div className="flex items-center space-x-4">
            
            <button onClick={() => navigate('/marketplace/cart')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 relative">
              <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((t, item) => t + (item.quantity || 1), 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="grid md:grid-cols-6 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="px-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white"
              value={filterUniversity}
              onChange={e => setFilterUniversity(e.target.value)}
            >
              {universities.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <select
              className="px-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white"
              value={filterCondition}
              onChange={e => setFilterCondition(e.target.value)}
            >
              {conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder="Min Price"
              className="px-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white"
              value={filterPriceMin}
              onChange={e => setFilterPriceMin(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price"
              className="px-4 py-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white"
              value={filterPriceMax}
              onChange={e => setFilterPriceMax(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs and Sort */}
        <div className="flex items-center mb-4">
          <div className="flex overflow-x-auto">
            <button
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                activeCategory === 'all' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center px-4 py-2 mr-2 rounded-lg whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div 
              key={listing._id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/marketplace/listing/${listing._id}`)}
            >
              <div className="h-48 overflow-hidden">
                {listing.images?.[0] ? (
                  <img 
                    src={`http://localhost:5000/images/${listing.images[0]}`}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <ShoppingCart size={48} className="text-gray-400" />
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
                {listing.seller === localStorage.getItem('userId') ? (
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="w-full mt-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                    disabled
                    title="You cannot add your own listing to cart"
                  >
                    Your Listing
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(listing);
                    }}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No listings found with these filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;