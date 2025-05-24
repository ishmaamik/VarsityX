import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowLeft, MapPin, MessageSquare, Shield, User, Star, 
  ChevronDown, DollarSign, Gavel, Clock, ShoppingCart, Moon, Sun
} from 'lucide-react';

const ListingDetail = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState('');

  // Sample listing data with different pricing types
  const listing = {
    id: 1,
    title: 'Calculus Textbook',
    priceType: 'fixed', // 'fixed', 'bidding', or 'hourly'
    price: 25,
    startingBid: 20,
    currentBid: 22,
    hourlyRate: 15,
    category: 'textbooks',
    condition: 'Like New',
    description: 'Calculus: Early Transcendentals (8th Edition) by James Stewart. Used for one semester, no markings or highlights.',
    seller: {
      name: 'John Doe',
      university: 'IUT',
      rating: 4.8,
      listings: 12,
      memberSince: '2022'
    },
    images: [
      'textbook1.jpg',
      'textbook2.jpg',
      'textbook3.jpg'
    ],
    posted: '3 days ago',
    bids: [
      { id: 1, bidder: 'Alice', amount: 22, time: '2 hours ago' },
      { id: 2, bidder: 'Bob', amount: 21, time: '5 hours ago' }
    ]
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    console.log('Bid placed:', bidAmount);
    // In a real app, this would submit to your backend
  };

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
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img 
                src={listing.images[0]} 
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {listing.images.map((img, index) => (
                <div key={index} className="h-24 bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer">
                  <img 
                    src={img} 
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
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 mr-2">${listing.price}</span>
                  {listing.condition && (
                    <span className="text-gray-600 dark:text-gray-300">({listing.condition})</span>
                  )}
                </div>
              )}

              {listing.priceType === 'bidding' && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                      Current Bid: ${listing.currentBid}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Starting bid: ${listing.startingBid} • {listing.bids.length} bids
                  </p>
                </div>
              )}

              {listing.priceType === 'hourly' && (
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                    ${listing.hourlyRate}/hour
                  </span>
                </div>
              )}

              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
                <MapPin size={16} className="mr-1" />
                <span>{listing.seller.university}</span>
                <span className="mx-2">•</span>
                <span>Posted {listing.posted}</span>
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Minimum $${listing.currentBid + 1}`}
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
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    <ShoppingCart className="inline mr-2" size={18} />
                    Add to Cart
                  </button>
                )}
                <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 flex items-center justify-center">
                  <MessageSquare className="mr-2" size={18} />
                  Message Seller
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-4">
                  <User size={24} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">{listing.seller.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Star className="text-yellow-500 mr-1" size={14} />
                    <span>{listing.seller.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{listing.seller.listings} listings</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p>Member since {listing.seller.memberSince}</p>
                <p className="flex items-center">
                  <Shield className="mr-1" size={14} />
                  <span>University verified</span>
                </p>
              </div>
              <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
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
                Bids ({listing.bids.length})
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
                      <p className="font-medium dark:text-white">{listing.condition}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Seller University</p>
                    <p className="font-medium dark:text-white">{listing.seller.university}</p>
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
                  {listing.bids.map(bid => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">{bid.bidder}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{bid.time}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${bid.amount}</span>
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