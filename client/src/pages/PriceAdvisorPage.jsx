import React, { useState } from "react";
import axios from "axios";
import { Upload, DollarSign, Camera, Loader, Tag, ThumbsUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PriceAdvisorPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResponseText("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResponseText("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    setResponseText("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/price-advisor",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponseText(res.data.generatedText);
    } catch (err) {
      console.error("Error:", err);
      setResponseText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Smart Price Advisor <DollarSign className="inline-block text-blue-500" />
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get instant price suggestions for your items using our AI-powered analysis
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
                  ${preview ? 'border-none p-0' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  id="file-upload"
                />
                
                {!preview ? (
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <Camera className="w-12 h-12 text-blue-500" />
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      Drag and drop your image here or click to browse
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </label>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <label 
                        htmlFor="file-upload"
                        className="cursor-pointer px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Change Image
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={!file || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2" />
                    Analyzing Image...
                  </span>
                ) : (
                  'Get Price Suggestion'
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {responseText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Price Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Tag className="w-6 h-6 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {responseText.match(/PRICE: (.*)/)?.[1] || "N/A"}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Market Value: {responseText.match(/MARKET: (.*)/)?.[1] || "N/A"}
                      </div>
                    </div>
                  </motion.div>

                  {/* Condition & Demand Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <ThumbsUp className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Condition:</span>
                        <span className="font-semibold text-green-600">
                          {responseText.match(/CONDITION: (.*)/)?.[1] || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Market Demand:</span>
                        <span className="font-semibold text-blue-600">
                          {responseText.match(/DEMAND: (.*)/)?.[1] || "N/A"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Insights Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Insights</h3>
                    </div>
                    <div className="prose prose-blue dark:prose-invert">
                      <div className="text-gray-600 dark:text-gray-300">
                        {responseText.match(/INSIGHTS:([\s\S]*?)(?=\n\n|$)/)?.[1] || "No insights available"}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PriceAdvisorPage;