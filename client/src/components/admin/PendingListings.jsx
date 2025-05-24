import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PendingListings = () => {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/listings/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingListings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      toast.error('Failed to fetch pending listings');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (listingId, action) => {
    try {
      setModerating(true);
      const token = localStorage.getItem('token');

      // If rejecting, show rejection reason modal
      if (action === 'reject' && !rejectionReason) {
        setSelectedListing(listingId);
        return;
      }

      await axios.post(
        `http://localhost:5000/api/listings/${listingId}/moderate`,
        {
          action,
          reason: rejectionReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Listing ${action}ed successfully`);
      fetchPendingListings();
      setRejectionReason('');
      setSelectedListing(null);
    } catch (error) {
      console.error('Error moderating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to moderate listing');
    } finally {
      setModerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Pending Listings</h2>
      </div>

      {pendingListings.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No pending listings to review
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingListings.map((listing) => (
                <tr key={listing._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {listing.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {listing.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {listing.seller.displayName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {listing.seller.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {listing.university}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ৳{listing.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleModeration(listing._id, 'approve')}
                      disabled={moderating}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleModeration(listing._id, 'reject')}
                      disabled={moderating}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Rejection Reason</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter reason for rejection..."
              rows="3"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedListing(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModeration(selectedListing, 'reject')}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingListings; 