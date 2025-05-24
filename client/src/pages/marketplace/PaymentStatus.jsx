import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    const verifyPayment = async () => {
      try {
        // Get payment status from URL parameters
        const paymentStatus = searchParams.get('status');
        const transactionId = searchParams.get('transactionId');
        console.log('Payment status:', paymentStatus);
        console.log('Transaction ID:', transactionId);
        
        if (paymentStatus === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your order has been placed.');
          // Clear cart after successful payment
          try {
            const token = localStorage.getItem('token');
            if (token) {
              await axios.delete('http://localhost:5000/cart', {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Cart cleared successfully');
            }
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
          setTimeout(() => navigate('/marketplace'), 3000);
        } else if (paymentStatus === 'failed') {
          setStatus('error');
          setMessage('Payment failed. Please try again.');
          setTimeout(() => navigate('/marketplace/cart'), 3000);
        } else if (paymentStatus === 'cancelled') {
          setStatus('error');
          setMessage('Payment was cancelled.');
          setTimeout(() => navigate('/marketplace/cart'), 3000);
        } else if (paymentStatus === 'error') {
          setStatus('error');
          setMessage('An error occurred during payment.');
          setTimeout(() => navigate('/marketplace/cart'), 3000);
        } else {
          console.log('Invalid or missing payment status:', paymentStatus);
          setStatus('error');
          setMessage('Invalid payment status.');
          setTimeout(() => navigate('/marketplace/cart'), 3000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred while verifying payment.');
        setTimeout(() => navigate('/marketplace/cart'), 3000);
      }
    };

    verifyPayment();
  }, [navigate, searchParams, location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          {status === 'loading' && (
            <>
              <Loader className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Processing Payment
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Redirecting to marketplace...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                Payment Failed
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Redirecting back to cart...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 