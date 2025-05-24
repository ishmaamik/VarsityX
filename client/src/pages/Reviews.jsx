import React, { useState } from 'react';
import { Star, Filter, ThumbsUp, MessageSquare, Image as ImageIcon, Shield, CheckCircle, AlertCircle, Clock, User } from 'lucide-react';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data - replace with actual API data
  const reviews = [
    {
      id: 1,
      type: 'product',
      product: {
        name: 'MacBook Pro 2020',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D',
        price: 1200,
      },
      user: {
        name: 'Faiza Rahman',
        avatar: 'https://ui-avatars.com/api/?name=Faiza+Rahman&background=0D8ABC&color=fff',
        isVerified: true,
        university: 'DU',
      },
      rating: 5,
      comment: 'The product was exactly as described and the seller was very responsive. Great experience overall!',
      images: [
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZXxlbnwwfHwwfHx8MA%3D%3D',
      ],
      likes: 12,
      date: '2 days ago',
      isVerifiedPurchase: true,
      helpful: 8,
      replies: [
        {
          user: {
            name: 'Seller',
            avatar: 'https://ui-avatars.com/api/?name=Seller&background=0D8ABC&color=fff',
            isVerified: true,
          },
          comment: 'Thank you for your kind words!',
          date: '1 day ago',
        },
      ],
    },
    {
      id: 2,
      type: 'seller',
      seller: {
        name: 'Rahim Khan',
        avatar: 'https://ui-avatars.com/api/?name=Rahim+Khan&background=0D8ABC&color=fff',
        isVerified: true,
        university: 'IUT',
        totalSales: 45,
        rating: 4.8,
      },
      user: {
        name: 'Sara Ahmed',
        avatar: 'https://ui-avatars.com/api/?name=Sara+Ahmed&background=0D8ABC&color=fff',
        isVerified: true,
        university: 'BUET',
      },
      rating: 4,
      comment: 'Very professional and punctual. The item was exactly as described.',
      images: [],
      likes: 5,
      date: '1 week ago',
      isVerifiedPurchase: true,
      helpful: 3,
    },
  ];

  const renderReviewCard = (review) => (
    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Review Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-12 h-12 rounded-full border-2 border-purple-500"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{review.user.name}</h3>
                {review.user.isVerified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{review.user.university}</span>
                <span>•</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>
          {review.isVerifiedPurchase && (
            <span className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Purchase</span>
            </span>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="p-6">
        {review.type === 'product' && (
          <div className="mb-4 flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <img
              src={review.product.image}
              alt={review.product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium">{review.product.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${review.product.price}
              </p>
            </div>
          </div>
        )}

        {review.type === 'seller' && (
          <div className="mb-4 flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <img
              src={review.seller.avatar}
              alt={review.seller.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium">{review.seller.name}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{review.seller.totalSales} sales</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{review.seller.rating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {review.comment}
        </p>

        {review.images.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        )}

        {/* Review Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              <MessageSquare className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400">
            <AlertCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Replies Section */}
        {review.replies && review.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {review.replies.map((reply, index) => (
              <div key={index} className="flex space-x-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <img
                  src={reply.user.avatar}
                  alt={reply.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{reply.user.name}</span>
                    {reply.user.isVerified && (
                      <Shield className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-500">{reply.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {reply.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all reviews</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  All Reviews
                </button>
                <button
                  onClick={() => setActiveFilter('product')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === 'product'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  Product Reviews
                </button>
                <button
                  onClick={() => setActiveFilter('seller')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === 'seller'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  Seller Reviews
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews
            .filter(review => activeFilter === 'all' || review.type === activeFilter)
            .map(renderReviewCard)}
        </div>
      </div>
    </div>
  );
};

export default Reviews; 