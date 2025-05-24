import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Book, Laptop, Bike, GraduationCap, MessageSquare, 
  Image, X, ChevronDown, DollarSign, Clock, Gavel, Eye, EyeOff, Moon, Sun, Loader
} from 'lucide-react';
import axios from 'axios';

const SellPage = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'textbooks',
    priceType: 'fixed',
    price: '',
    startingBid: '',
    hourlyRate: '',
    condition: 'good',
    university: 'IUT',
    visibility: 'university'
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]); // Store uploaded image URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'textbooks', label: 'Textbooks', icon: <Book size={18} /> },
    { value: 'electronics', label: 'Electronics', icon: <Laptop size={18} /> },
    { value: 'transport', label: 'Transport', icon: <Bike size={18} /> },
    { value: 'tutoring', label: 'Tutoring', icon: <GraduationCap size={18} /> },
    { value: 'skill-exchange', label: 'Skill Exchange', icon: <MessageSquare size={18} /> },
  ];

  const universities = ['IUT', 'DU', 'BUET', 'NSU', 'BRAC'];
  const conditions = ['new', 'like new', 'good', 'fair'];

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (typeof img === 'string' && img.startsWith('blob:')) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      setError('You can upload a maximum of 6 images');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Only JPEG, JPG, and PNG files are allowed');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Upload each file and get URLs
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(
          'http://localhost:5000/images/upload', 
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            },
            timeout: 30000 // 30 second timeout
          }
        );
        
        // Return the complete URL for the image
        return response.data.file;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add URLs to both preview and final URL arrays
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      setImages(prev => [...prev, ...uploadedUrls.map(url => `http://localhost:5000/images/${url}`)]);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    
    // Clean up blob URL if it's a local preview
    if (typeof imageToRemove === 'string' && imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare listing data with uploaded image URLs
      const listingData = {
        ...formData,
        images: imageUrls
      };

      // Adjust pricing fields based on priceType
      if (formData.priceType === 'fixed') {
        listingData.price = Number(formData.price);
        delete listingData.startingBid;
        delete listingData.hourlyRate;
      } else if (formData.priceType === 'bidding') {
        listingData.startingBid = Number(formData.startingBid);
        listingData.currentBid = Number(formData.startingBid);
        delete listingData.price;
        delete listingData.hourlyRate;
      } else if (formData.priceType === 'hourly') {
        listingData.hourlyRate = Number(formData.hourlyRate);
        delete listingData.price;
        delete listingData.startingBid;
      }

      // Create the listing
      await axios.post('http://localhost:5000/marketplace', listingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/marketplace');
    } catch (err) {
      console.error('Listing creation error:', err);
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Sell Your Item or Service</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Category</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Listing Title */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What are you offering?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide details about your item or service..."
              required
            />
          </div>

          {/* Pricing Options */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Pricing Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priceType: 'fixed' }))}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  formData.priceType === 'fixed' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                <DollarSign className="mr-2" size={16} />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priceType: 'bidding' }))}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  formData.priceType === 'bidding' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                <Gavel className="mr-2" size={16} />
                Accept Bids
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priceType: 'hourly' }))}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  formData.priceType === 'hourly' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                <Clock className="mr-2" size={16} />
                Hourly Rate
              </button>
            </div>

            {/* Dynamic Price Input */}
            {formData.priceType === 'fixed' && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">৳</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            )}

            {formData.priceType === 'bidding' && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Starting Bid</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">৳</span>
                  <input
                    type="number"
                    name="startingBid"
                    value={formData.startingBid}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            )}

            {formData.priceType === 'hourly' && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Hourly Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">৳</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Visibility Options */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Visibility</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: 'university' }))}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  formData.visibility === 'university' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                <EyeOff className="mr-2" size={16} />
                My University Only
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: 'all' }))}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  formData.visibility === 'all' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                <Eye className="mr-2" size={16} />
                All Universities
              </button>
            </div>
          </div>

          {/* University Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Your University</label>
            <div className="relative">
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Condition (for physical items) */}
          {(formData.category === 'textbooks' || formData.category === 'electronics') && (
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Condition</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {conditions.map(cond => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                    className={`p-2 border rounded-lg text-center transition-colors ${
                      formData.condition === cond
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white'
                    }`}
                  >
                    {cond.charAt(0).toUpperCase() + cond.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {images.length < 6 && (
                <label className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    disabled={loading}
                  />
                  <div className="text-center">
                    {loading ? (
                      <Loader className="animate-spin mx-auto mb-1 text-gray-400" size={24} />
                    ) : (
                      <Image className="mx-auto mb-1 text-gray-400" size={24} />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {loading ? 'Uploading...' : 'Add photos'}
                    </span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload up to 6 photos (JPEG, PNG only) - At least 1 image required
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || imageUrls.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={18} />
                Publishing...
              </>
            ) : (
              'Publish Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellPage;