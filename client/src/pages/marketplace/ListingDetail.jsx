import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowLeft, MapPin, MessageSquare, Shield, User, Star, 
  ChevronDown, DollarSign, Gavel, Clock, ShoppingCart, Moon, Sun, Loader
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState('');
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/user/user-data', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const [listingResponse, bidsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/marketplace/${id}`),
          axios.get(`http://localhost:5000/api/bids/listings/${id}`)
        ]);
        
        setListing({
          ...listingResponse.data.listing,
          bids: bidsResponse.data.bids || []
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

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

  // Place a bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:5000/api/bids/listings/${id}/bid`,
        { amount: parseFloat(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update listing with new bid
        setListing(prev => ({
          ...prev,
          currentBid: parseFloat(bidAmount),
          bids: [...(prev.bids || []), response.data.bid]
        }));
        
        setBidAmount('');
        toast.success('Bid placed successfully!');
      }
    } catch (err) {
      console.error('Error placing bid:', err);
      toast.error(err.response?.data?.message || 'Failed to place bid');
    }
  };

  // Add to cart
  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/cart', 
          { listingId: listing._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update local state
        setCartItems(prev => {
          const existing = prev.find(item => item.listing?._id === listing._id);
          if (existing) {
            return prev.map(item => 
              item.listing?._id === listing._id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            );
          }
          return [...prev, { listing, quantity }];
        });
      } else {
        // For guest users
        const updated = [...cartItems];
        const existing = updated.find(item => item.listing?._id === listing._id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          updated.push({ listing, quantity });
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

  const handleMessageSeller = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/messages/conversations/listing/${listing._id}`,
        { message: `Hi, I'm interested in your listing: ${listing.title}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/messages', { 
          state: { selectedChat: response.data.data }
        });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation with seller');
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

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to listings
          </button>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {listing.images?.[0] ? (
                <img 
                  src={`http://localhost:5000/images/${listing.images[0]}`}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart size={48} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {listing.images?.map((img, index) => (
                <div key={index} className="h-24 bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer">
                  <img 
                    src={`http://localhost:5000/images/${img}`}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Listing Info */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold dark:text-white">{listing.title}</h1>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
                  {listing.category}
                </span>
              </div>

              {/* Dynamic Pricing Display */}
              {listing.priceType === 'fixed' && (
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 mr-2">৳{listing.price}</span>
                  {listing.condition && (
                    <span className="text-gray-600 dark:text-gray-300">({listing.condition})</span>
                  )}
                </div>
              )}

              {listing.priceType === 'bidding' && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                      Current Bid: ৳{listing.currentBid}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Starting bid: ৳{listing.startingBid} • {listing.bids?.length || 0} bids
                  </p>
                </div>
              )}

              {listing.priceType === 'hourly' && (
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                    ৳{listing.hourlyRate}/hour
                  </span>
                </div>
              )}

              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
                <MapPin size={16} className="mr-1" />
                <span>{listing.university}</span>
                <span className="mx-2">•</span>
                <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Quantity Selector (for fixed price items) */}
              {listing.priceType === 'fixed' && (
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Quantity</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 border rounded-l-lg dark:border-gray-600"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b dark:border-gray-600">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1 border rounded-r-lg dark:border-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Bid Form (for bidding items) */}
              {listing.priceType === 'bidding' && (
                <form onSubmit={handlePlaceBid} className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Place Your Bid</label>
                  <div className="flex">
                    <div className="relative flex-grow mr-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">৳</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Minimum ৳${listing.currentBid + 1}`}
                        min={listing.currentBid + 1}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Bid Now
                    </button>
                  </div>
                </form>
              )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                {listing.priceType === 'fixed' && (
                  <button 
                    onClick={addToCart}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <ShoppingCart className="inline mr-2" size={18} />
                    Add to Cart
                  </button>
                )}
                
                {/* Only show message button if the current user is not the seller */}
                {currentUser && currentUser._id !== listing.seller._id && (
                  <button 
                    onClick={handleMessageSeller}
                    className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center justify-center"
                  >
                    <MessageSquare className="mr-2" size={18} />
                    Message Seller
                  </button>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-4">
                  <User size={24} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">{listing.seller.displayName}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Star className="text-yellow-500 mr-1" size={14} />
                    <span>{listing.seller.rating || 'No ratings'}</span>
                    <span className="mx-2">•</span>
                    <span>{listing.seller.listings?.length || 0} listings</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p>Member since {new Date(listing.seller.createdAt).getFullYear()}</p>
                <p className="flex items-center">
                  <Shield className="mr-1" size={14} />
                  <span>University verified</span>
                </p>
              </div>
              <button 
                onClick={() => navigate(`/profile/${listing.seller._id}`)}
                className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Details
            </button>
            {listing.priceType === 'bidding' && (
              <button
                onClick={() => setActiveTab('bids')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'bids' 
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Bids ({listing.bids?.length || 0})
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'reviews' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-md p-6">
            {activeTab === 'details' ? (
              <div>
                <h3 className="font-bold mb-4 dark:text-white">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{listing.description}</p>
                
                <h3 className="font-bold mb-4 dark:text-white">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Category</p>
                    <p className="font-medium dark:text-white">{listing.category}</p>
                  </div>
                  {listing.condition && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Condition</p>
                      <p className="font-medium dark:text-white">
                        {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Seller University</p>
                    <p className="font-medium dark:text-white">{listing.university}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Pricing Type</p>
                    <p className="font-medium dark:text-white">
                      {listing.priceType === 'fixed' ? 'Fixed Price' : 
                       listing.priceType === 'bidding' ? 'Bidding' : 'Hourly Rate'}
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'bids' ? (
              <div>
                <h3 className="font-bold mb-4 dark:text-white">Current Bids</h3>
                <div className="space-y-3">
                  {listing.bids?.map((bid, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">{bid.bidder.displayName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(bid.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{bid.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-300">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;