// SellPage.jsx - Fixed version
import React, { useState } from 'react';
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
    currentBid: '',
    hourlyRate: '',
    condition: 'good',
    university: 'IUT',
    visibility: 'university'
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Fixed: was e.target.file
    if (files.length + images.length > 6) {
      setError('You can upload a maximum of 6 images');
      return;
    }

    // Store the actual files for upload
    setImageFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...previewUrls]);
    
    // Clear any previous errors
    setError(null);
  };

  const removeImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(images[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      if (imageFiles.length === 0) {
        setError('Please select at least one image to upload');
        setLoading(false);
        return;
      }
  
      // Upload the first image file
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFiles[0]);
  
      const uploadResponse = await axios.post('http://localhost:5000/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Upload failed');
      }
  
      // Prepare listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priceType: formData.priceType,
        price: formData.priceType === 'fixed' ? parseFloat(formData.price) : undefined,
        startingBid: formData.priceType === 'bidding' ? parseFloat(formData.startingBid) : undefined,
        hourlyRate: formData.priceType === 'hourly' ? parseFloat(formData.hourlyRate) : undefined,
        condition: formData.condition,
        university: formData.university,
        visibility: formData.visibility,
        images: [uploadResponse.data.file.url]
      };
  
      // Create the listing
      const listingResponse = await axios.post('http://localhost:5000/marketplace', listingData, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
  
      if (listingResponse.data.success !== false) {
        // Clean up object URLs
        images.forEach(url => URL.revokeObjectURL(url));
        navigate('/marketplace');
      } else {
        throw new Error(listingResponse.data.message || 'Failed to create listing');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create listing');
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
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} />}
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                    className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
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
                    accept="image/*"
                  />
                  <div className="text-center">
                    <Image className="mx-auto mb-1 text-gray-400" size={24} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Add photos</span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload up to 6 photos (at least 1 required)</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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