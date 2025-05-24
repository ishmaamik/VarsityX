import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  return (
    <Link 
      to={`/marketplace/listings/${listing._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Listing Image */}
      <div className="relative h-48">
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

      {/* Listing Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {listing.title}
        </h3>
        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          ${listing.price}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {listing.description}
        </p>

        {/* Seller Info */}
        <div className="mt-4 flex items-center">
          <img
            src={listing.seller?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller?.displayName || '')}`}
            alt={listing.seller?.displayName}
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {listing.seller?.displayName}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 