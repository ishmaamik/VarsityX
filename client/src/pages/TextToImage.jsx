import React, { useState } from 'react';

const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Using Unsplash API through a proxy to avoid CORS issues
      const response = await fetch(
        `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      // Unsplash returns a redirected URL which is the actual image
      setImages(prev => [...prev, response.url]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Image Search Generator
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="text-gray-700 dark:text-gray-200">
              Enter keywords to search for images
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter keywords (e.g., 'mountain landscape sunset')"
              className="w-full p-3 border rounded-lg min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search Images'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt={`Generated ${index + 1}`}
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="p-4 flex justify-end">
                <a
                  href={imageUrl}
                  download={`image-${index + 1}.jpg`}
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Image
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextToImage;