import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader } from 'lucide-react';
import axios from 'axios';

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/marketplace', {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            onlyOwn: 'true',
            includeOwn: 'true'
          }
        });
        
        console.log('My listings response:', response.data);
        setListings(response.data.listings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.response?.data?.message || 'Failed to fetch your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [navigate]);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">My Listings</h1>
          <button
            onClick={() => navigate('/marketplace/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">You haven't created any listings yet</p>
            <button
              onClick={() => navigate('/marketplace/create')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Listing
            </button>
          </div>
        ) : (
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
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/marketplace/edit/${listing._id}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings; 