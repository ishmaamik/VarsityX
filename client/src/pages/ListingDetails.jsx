import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ListingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get listing ID from URL
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/marketplace/listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleMessageSeller = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        '/api/messages/conversations/from-listing',
        { listingId: listing._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/messages', { 
          state: { selectedConversation: response.data.data }
        });
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation with seller');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Listing Images */}
        <div className="relative h-96">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {listing.title}
              </h1>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                ${listing.price}
              </p>
            </div>
            
            {/* Message Button */}
            <button
              onClick={handleMessageSeller}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Message Seller
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Description
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {listing.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <img
                src={listing.seller?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller?.displayName || '')}`}
                alt={listing.seller?.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {listing.seller?.displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {listing.seller?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails; 