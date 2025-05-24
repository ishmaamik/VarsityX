import React, { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const ReviewForm = ({ targetId, type, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/reviews/submit', {
        targetId,
        type,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRating(0);
      setComment('');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Write a Review</h3>
      
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`${
                star <= (hover || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-4"
        rows="4"
        required
      />

      <button
        type="submit"
        disabled={!rating}
        className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;