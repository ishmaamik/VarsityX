import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ChevronDown, ShoppingCart, Moon, Sun, Loader, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Load cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartItems(response.data.cart || []);
        } else {
          const savedCart = localStorage.getItem('cartItems');
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cart');
        toast.error('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.put(`http://localhost:5000/api/cart/${itemId}`, 
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data.cart);
      } else {
        const updatedCart = cartItems.map(item => 
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data.cart);
        toast.success('Item removed from cart');
      } else {
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setCartItems([]);
      localStorage.removeItem('cartItems');
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.listing?.price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = 0; // Free shipping for students
    return subtotal + shipping;
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to checkout');
        navigate('/login');
        return;
      }

      // Initialize payment
      const response = await axios.post(
        'http://localhost:5000/api/payment/init',
        {
          items: cartItems.map(item => ({
            listing: item.listing._id,
            quantity: item.quantity,
            price: item.listing.price
          })),
          totalAmount: calculateTotal()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to SSLCommerz payment gateway
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 dark:text-red-400">{error}</p>
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4 border-b dark:border-gray-700 last:border-0">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      {item.listing?.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/images/${item.listing.images[0]}`}
                          alt={item.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">{item.listing?.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.listing?.university}</p>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">৳{item.listing?.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="font-semibold dark:text-white">৳{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold dark:text-white">Total</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">৳{calculateTotal()}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className={`bg-blue-600 text-white px-8 py-2 rounded-lg ${
                    processing
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  }`}
                >
                  {processing ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;