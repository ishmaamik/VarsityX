import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ChevronDown, ShoppingCart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Cart = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Remove item
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = 0; // Free shipping for students
    return subtotal + shipping;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/marketplace/buy')}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Continue Shopping
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              
            </button>
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Your Cart</h1>
          </div>
          
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={40} className="text-gray-400 dark:text-gray-300" />
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Browse our marketplace to find what you need</p>
            <button
              onClick={() => navigate('/marketplace/buy')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
                  <div className="flex flex-col sm:flex-row">
                    {/* Item Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 sm:mb-0">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-300">
                          <ShoppingCart size={32} />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow sm:ml-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-bold dark:text-white">{item.title}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{item.category}</p>
                      <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">৳{item.price}</p>

                      {/* Quantity Selector */}
                      <div className="flex items-center">
                        <span className="mr-4 dark:text-gray-300">Quantity:</span>
                        <div className="flex items-center border rounded-lg dark:border-gray-600">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x dark:border-gray-600 dark:text-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>৳{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>
                  <div className="border-t pt-3 dark:border-gray-700"></div>
                  <div className="flex justify-between font-bold text-lg dark:text-white">
                    <span>Total</span>
                    <span>৳{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/marketplace/checkout')}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center mb-1">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Campus pickup available
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Secure student-to-student transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;