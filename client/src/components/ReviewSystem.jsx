import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  Send,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

const ReviewSystem = ({ type = 'product', itemId, sellerId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual API calls
  const reviews = [
    {
      id: 1,
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
    },
    {
      id: 2,
      user: {
        name: 'Rahim Khan',
        avatar: 'https://ui-avatars.com/api/?name=Rahim+Khan&background=0D8ABC&color=fff',
        isVerified: true,
        university: 'IUT',
      },
      rating: 4,
      comment: 'Good quality product, but shipping took longer than expected.',
      images: [],
      likes: 5,
      date: '1 week ago',
      isVerifiedPurchase: true,
      helpful: 3,
    },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
    setImages([...images, ...files]);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle review submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      setRating(0);
      setReview('');
      setImages([]);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {/* Review Form */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          {/* Rating Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="Share your experience..."
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !review}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 ${
              isSubmitting || rating === 0 || !review
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700">
              <option>Most Recent</option>
              <option>Most Helpful</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{review.user.name}</h4>
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
                  <span className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Purchase</span>
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3">
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

              {/* Review Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSystem; 